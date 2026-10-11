import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const root = path.resolve(import.meta.dirname, '..');
const sources = JSON.parse(await fs.readFile(path.join(root, 'sources.json'), 'utf8'));
const settings = JSON.parse(await fs.readFile(path.join(root, 'authoring-settings.json'), 'utf8'));
const reviewedBatches = JSON.parse(await fs.readFile(path.join(root, 'reviewed-batches.json'), 'utf8'));
const names = (await fs.readdir(path.join(root, 'batches'))).filter(n => /^batch-\d+\.txt$/.test(n)).sort();
const questions = [];
const errors = [];
const normalise = s => s.normalize('NFKC').toLocaleLowerCase('az').replace(/[\p{P}\p{S}\s]+/gu, ' ').trim();
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const keys = new Set(), texts = new Set();
const difficultyRules = { asan: { points: 10, seconds: 20 }, orta: { points: 20, seconds: 25 }, 'çətin': { points: 30, seconds: 30 } };
for (const name of names) {
  const review = reviewedBatches[name];
  const lines = (await fs.readFile(path.join(root, 'batches', name), 'utf8')).split(/\r?\n/).filter(s => s.trim());
  for (let line = 0; line < lines.length; line++) {
    const fields = lines[line].split('|');
    if (fields.length !== 10) { errors.push(`${name}:${line+1}: expected 10 fields, got ${fields.length}`); continue; }
    const [category,difficulty,factKey,question,correct,...tail] = fields.map(s => s.trim());
    const [wrong1,wrong2,wrong3,sourceId,verificationNote] = tail;
    const id = `AZQ-${String(questions.length+1).padStart(5,'0')}`;
    if (fields.some(s => !s.trim())) errors.push(`${id}: empty field`);
    if (!difficultyRules[difficulty]) errors.push(`${id}: invalid difficulty`);
    if (!sources[sourceId]) errors.push(`${id}: missing source ${sourceId}`);
    if (keys.has(factKey)) errors.push(`${id}: repeated fact key ${factKey}`);
    if (texts.has(normalise(question))) errors.push(`${id}: repeated question text`);
    if (new Set([correct,wrong1,wrong2,wrong3].map(normalise)).size !== 4) errors.push(`${id}: repeated option`);
    if (question.length > 320) errors.push(`${id}: question exceeds 320 characters`);
    keys.add(factKey); texts.add(normalise(question));
    const correctPosition = Number.parseInt(hash(factKey).slice(0,8),16)%4;
    const distractors = [wrong1,wrong2,wrong3].sort((a,b) => hash(factKey+a).localeCompare(hash(factKey+b)));
    const options = [...distractors]; options.splice(correctPosition,0,correct);
    questions.push({ id, language:'az', category, difficulty, difficultyStatus:'provisional', factKey, question,
      options:Object.fromEntries(options.map((value,i)=>['ABCD'[i],value])), correctOption:'ABCD'[correctPosition],
      correctAnswer:correct, points:difficultyRules[difficulty]?.points, timeLimitSeconds:difficultyRules[difficulty]?.seconds,
      sourceId, source:sources[sourceId], verification:{method:review?.reviewed?(sourceId==='CAL'?'derivation':sourceId==='LANG'?'linguistic_analysis':'source_comparison'):'pending',checkedAt:review?.reviewed?review.checkedAt:null,note:verificationNote},
      status:review?.reviewed?'review_ready':'draft', batch:name, contentHash:hash(normalise(question)) });
  }
}
if (errors.length) throw new Error(errors.join('\n'));

// Similar wording is a review signal, never an automatic proof of semantic uniqueness.
const candidates=[];
const tokens=questions.map(q=>new Set(normalise(q.question).split(' ').filter(w=>w.length>3)));
const postings=new Map();
for(let i=0;i<questions.length;i++) {
  const overlaps=new Map();
  for(const token of tokens[i]) for(const j of postings.get(token)??[]) overlaps.set(j,(overlaps.get(j)??0)+1);
  for(const [j,shared] of overlaps) {
    const score=shared/(tokens[i].size+tokens[j].size-shared);
    if(score>=0.5)candidates.push({ids:[questions[j].id,questions[i].id],wordOverlap:Number(score.toFixed(3))});
  }
  for(const token of tokens[i]){if(!postings.has(token))postings.set(token,[]);postings.get(token).push(i);}
}
const countBy = field => Object.fromEntries([...new Set(questions.map(q=>q[field]))].sort().map(v=>[v,questions.filter(q=>q[field]===v).length]));
const existingProgressPath=path.join(root,'progress.json');
let previous={};try{previous=JSON.parse(await fs.readFile(existingProgressPath,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const progress={target:settings.target,authored:questions.length,reviewReady:questions.filter(q=>q.status==='review_ready').length,sourceCompared:questions.filter(q=>q.verification.method==='source_comparison').length,
  derived:questions.filter(q=>q.verification.method==='derivation').length,linguisticallyAnalysed:questions.filter(q=>q.verification.method==='linguistic_analysis').length,importedToDatabase:previous.importedToDatabase??0,
  remainingToAuthor:settings.target-questions.length,difficultyTargets:settings.difficultyTargets,byDifficulty:countBy('difficulty'),
  byCategory:countBy('category'),byCorrectOption:countBy('correctOption'),complete:questions.length===settings.target&&questions.every(q=>q.status==='review_ready')&&Object.entries(settings.difficultyTargets).every(([k,n])=>countBy('difficulty')[k]===n),
  lastUpdated:'2026-10-05',difficultyCalibration:'Oyunçu sınağı aparılmayıb; çətinliklər ilkin qiymətləndirmədir.'};
for(const dir of ['data','qa','sql','outputs/01a10932-ea68-7a01-b9cb-b7de3ae9ca73'])await fs.mkdir(path.join(root,dir),{recursive:true});
await fs.writeFile(path.join(root,'data/questions.jsonl'),questions.map(q=>JSON.stringify(q)).join('\n')+'\n');
await fs.writeFile(existingProgressPath,JSON.stringify(progress,null,2)+'\n');
await fs.writeFile(path.join(root,'qa/validation.json'),JSON.stringify({records:questions.length,emptyFields:0,repeatedFactKeys:0,repeatedExactTexts:0,repeatedOptions:0,wordingCandidates:candidates,semanticReview:`${progress.reviewReady} sual müəllif tərəfindən məna və variantlar baxımından nəzərdən keçirilib. Avtomatik yoxlama məna təkrarını təkbaşına müəyyən etmir.`},null,2)+'\n');
const quote = s => '"'+String(s??'').replaceAll('"','""')+'"';
const headers=['ID','Sual','A','B','C','D','Düzgün variant','Çətinlik','Kateqoriya','Mənbə','Mənbə ünvanı','Daxili yoxlama qeydi'];
const rows=questions.map(q=>[q.id,q.question,q.options.A,q.options.B,q.options.C,q.options.D,q.correctOption,q.difficulty,q.category,q.source.title,q.source.url??(q.sourceId==='LANG'?'Dil nümunəsinin təhlili':'Hesablama'),q.verification.note]);
await fs.writeFile(path.join(root,'data/questions.csv'),'\ufeff'+[headers,...rows].map(row=>row.map(quote).join(',')).join('\r\n')+'\r\n');

const sqlLiteral=s=>"'"+String(s).replaceAll("'","''")+"'";
const sql=`BEGIN;
CREATE SCHEMA IF NOT EXISTS question_bank;
CREATE TABLE IF NOT EXISTS question_bank.questions (
 id text PRIMARY KEY, fact_key text NOT NULL UNIQUE, language text NOT NULL CHECK(language='az'),
 category text NOT NULL, difficulty text NOT NULL CHECK(difficulty IN ('asan','orta','çətin')),
 question text NOT NULL, options jsonb NOT NULL CHECK(jsonb_typeof(options)='object'),
 correct_option text NOT NULL CHECK(correct_option IN ('A','B','C','D')),
 source jsonb NOT NULL, verification jsonb NOT NULL, status text NOT NULL DEFAULT 'review_ready',
 payload jsonb NOT NULL, content_hash text NOT NULL UNIQUE,
 CHECK(options ?& ARRAY['A','B','C','D']), CHECK(options ? correct_option),
 CHECK(options - ARRAY['A','B','C','D'] = '{}'::jsonb)
);
${questions.map(q=>`INSERT INTO question_bank.questions(id,fact_key,language,category,difficulty,question,options,correct_option,source,verification,status,payload,content_hash) VALUES (${[q.id,q.factKey,q.language,q.category,q.difficulty,q.question,JSON.stringify(q.options),q.correctOption,JSON.stringify(q.source),JSON.stringify(q.verification),q.status,JSON.stringify(q),q.contentHash].map(sqlLiteral).join(',')}) ON CONFLICT (id) DO NOTHING;`).join('\n')}
COMMIT;
`;
await fs.writeFile(path.join(root,'sql/import-questions.sql'),sql);

const workbook=Workbook.create();const sheet=workbook.worksheets.add('Suallar');sheet.showGridLines=false;
sheet.getRange(`A1:L${rows.length+1}`).values=[headers,...rows];
sheet.getRange(`A1:L${rows.length+1}`).format.font={name:'Arial',size:11,color:'#172B4D'};
sheet.getRange(`A1:L${rows.length+1}`).format.verticalAlignment='top';
sheet.getRange(`A1:L${rows.length+1}`).format.wrapText=true;
const table=sheet.tables.add(`A1:L${rows.length+1}`,true,'QuestionsTable');table.showFilterButton=true;
sheet.getRange('A1:L1').format={fill:'#18345D',font:{name:'Arial',size:11,bold:true,color:'#FFFFFF'},rowHeight:38,horizontalAlignment:'center',verticalAlignment:'center',wrapText:true};
const widths=[14,68,26,26,26,26,14,13,27,44,56,64];
for(let i=0;i<widths.length;i++)sheet.getRangeByIndexes(0,i,rows.length+1,1).format.columnWidth=widths[i];
for(let i=0;i<rows.length;i++) {
  const lines=Math.max(...rows[i].map((v,j)=>Math.ceil(String(v??'').length/Math.max(10,widths[j]*0.85))));
  sheet.getRange(`A${i+2}:L${i+2}`).format.rowHeight=Math.max(60,lines*17+12);
  if(i%2===1)sheet.getRange(`A${i+2}:L${i+2}`).format.fill='#F1F5FA';
}
sheet.getRange(`G2:H${rows.length+1}`).format.horizontalAlignment='center';
sheet.freezePanes.freezeRows(1);sheet.freezePanes.freezeColumns(2);
workbook.recalculate();
const inspect=await workbook.inspect({kind:'region',sheetId:'Suallar',range:`A${Math.max(2,questions.length-2)}:I${questions.length+1}`,maxChars:1800,tableMaxRows:4,tableMaxCols:9});
console.log(inspect.ndjson);
const preview=await workbook.render({sheetName:'Suallar',range:`A${Math.max(1,questions.length-3)}:I${questions.length+1}`,scale:1.3,format:'png'});
await fs.writeFile(path.join(root,'qa/preview.png'),new Uint8Array(await preview.arrayBuffer()));
const output=await SpreadsheetFile.exportXlsx(workbook);
await output.save(path.join(root,'outputs/01a10932-ea68-7a01-b9cb-b7de3ae9ca73/sual-banki.xlsx'));
await fs.writeFile(path.join(root,'IRƏLİLƏYİŞ.az.md'),`# Sual bankının irəliləyişi\n\nHədəf: **${progress.target.toLocaleString('az')}**. Yazılıb: **${questions.length}**. Yazılmalı: **${progress.remainingToAuthor}**.\n\nAsan: ${progress.byDifficulty.asan??0}; orta: ${progress.byDifficulty.orta??0}; çətin: ${progress.byDifficulty['çətin']??0}. Hədəf bölgüsü: asan ${progress.difficultyTargets.asan.toLocaleString('az')}, orta ${progress.difficultyTargets.orta.toLocaleString('az')}, çətin ${progress.difficultyTargets['çətin'].toLocaleString('az')}.\n\nMənbə ilə tutuşdurulan: ${progress.sourceCompared}. Həlli hesablanan: ${progress.derived}. Bazaya köçürülən: ${progress.importedToDatabase}.\n\n10.000 suallıq bank hələ tamamlanmayıb. Hazırlanmış hissə son baxış üçündür. Çətinliklər oyunçu sınağı ilə ölçülməyib.\n`);
console.log(JSON.stringify({authored:questions.length,difficulty:progress.byDifficulty,candidates,output:'sual-banki.xlsx'}));

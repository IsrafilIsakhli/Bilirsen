import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
questions=[json.loads(line) for line in (root/'data/questions.jsonl').read_text(encoding='utf-8').splitlines()]
database=json.loads((root/'qa/database-payloads.json').read_text(encoding='utf-8-sig'))
assert len(questions)==len(database)==850
assert questions[:750]==database[:750]
changes=[(old,new) for old,new in zip(database,questions) if old!=new]
assert len(changes)==1 and changes[0][1]['factKey']=='maillard-hodge-1953-reaction-mechanism'
old,new=changes[0]
def literal(value):
    if isinstance(value,dict):
        value=json.dumps(value,ensure_ascii=False)
    return "'"+str(value).replace("'","''")+"'"
columns={'fact_key':'factKey','language':'language','category':'category','difficulty':'difficulty',
         'question':'question','options':'options','correct_option':'correctOption',
         'source':'source','verification':'verification','status':'status','content_hash':'contentHash'}
assignments=[f'{column}={literal(new[key])}' for column,key in columns.items()]
assignments.append('payload='+literal(new))
sql="BEGIN;\nDO $repair$ BEGIN\nUPDATE question_bank.questions SET "+','.join(assignments)
sql+=' WHERE id='+literal(new['id'])+' AND content_hash='+literal(old['contentHash'])+';\n'
sql+="IF NOT FOUND THEN RAISE EXCEPTION 'Expected new question was not found'; END IF;\nEND $repair$;\nCOMMIT;\n"
(root/'sql/reconcile-new-850.sql').write_text(sql,encoding='utf-8')
print(json.dumps({'correctedNewQuestion':new['id'],'previous750Untouched':True}))

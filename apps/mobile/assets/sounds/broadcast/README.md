# Bilirsən? studio audio

The four files come from the Mixkit Game Show **sound effects** catalog. The [Mixkit Sound Effects Free License](https://mixkit.co/license/modal/sfxFree/) permits use in commercial and non-commercial video games and allows edits for use in the finished game. Its restrictions cover sharing individual effects and including them with source files. The WAVs are therefore Git-ignored and packaged locally into the game. See the [Mixkit User Terms](https://mixkit.co/terms/).

| In-game asset | Source | In-game edit |
| --- | --- | --- |
| `home_ambience.wav` | [Game show suspense waiting · Mixkit 667](https://mixkit.co/free-sound-effects/download/667/) | 28.8 s loop from the steady passage, with a 0.6 s overlap and gain adjustment. |
| `competition_tension.wav` | [Game show suspense timer · Mixkit 665](https://mixkit.co/free-sound-effects/download/665/) | 30 s excerpt including the beginning of the original outro, with short fades and gain adjustment. |
| `answer_correct.wav` | [Correct answer reward · Mixkit 952](https://mixkit.co/free-sound-effects/download/952/) | 1.35 s with a shortened tail and gain adjustment. |
| `answer_wrong.wav` | [Wrong answer fail notification · Mixkit 946](https://mixkit.co/free-sound-effects/download/946/) | 1.45 s with a shortened tail and gain adjustment. |

The download entries correspond to the named assets in the [Game Show catalog](https://mixkit.co/free-sound-effects/game-show/). All four use the same Sound Effects Free License.

## Install after cloning

Install [FFmpeg](https://ffmpeg.org/download.html), then run this from the repository root in PowerShell.

```powershell
./scripts/import-stock-audio.ps1
```

Use `-Ffmpeg C:/path/to/ffmpeg.exe` if FFmpeg is outside your PATH. The import script checks the official downloads against the source checksums, then applies the edits above. The resulting files are 44.1 kHz stereo PCM WAVs.

The source countdown has a steady pulse. During play, Expo Audio gradually raises the playback rate while preserving pitch. The server countdown determines both the expected position and the rate, so the 30-second excerpt aligns with 20-, 25- and 30-second questions. Settings previews play at the source rate.

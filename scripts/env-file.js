// Kleine Hilfe: Werte in .env setzen/ersetzen, ohne den Rest anzufassen.
import fs from 'node:fs';

export function setEnv(values, file = '.env') {
  let text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : fs.readFileSync('.env.example', 'utf8');
  for (const [k, v] of Object.entries(values)) {
    const line = `${k}=${v}`;
    const re = new RegExp(`^${k}=.*$`, 'm');
    text = re.test(text) ? text.replace(re, line) : `${text.trimEnd()}\n${line}\n`;
  }
  fs.writeFileSync(file, text);
}

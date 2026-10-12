import {spawn} from 'node:child_process';
const child=spawn('npm',['run','test:visual','--','--reporter=line'],{stdio:'inherit',env:{...process.env,CAPTURE_ONLY:'1'}});child.on('exit',c=>process.exit(c??1));
// Capture only is evidence collection, not screenshot-regression PASS.

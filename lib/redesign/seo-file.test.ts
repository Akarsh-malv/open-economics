import {describe,it,expect,vi} from 'vitest';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
vi.mock('server-only',()=>({}));
import {fileToDataUrl} from '@/lib/seo';
describe('social image file loading',()=>{it('accepts filesystem paths and URL objects from the DOM realm',async()=>{const dir=await mkdtemp(path.join(tmpdir(),'oep-og-test-'));try{const p=path.join(dir,'logo.png');await writeFile(p,Buffer.from('image fixture'));const expected='data:image/png;base64,'+Buffer.from('image fixture').toString('base64');expect(await fileToDataUrl(p,'image/png')).toBe(expected);expect(await fileToDataUrl(new URL(pathToFileURL(p).href),'image/png')).toBe(expected);}finally{await rm(dir,{recursive:true,force:true})}})});

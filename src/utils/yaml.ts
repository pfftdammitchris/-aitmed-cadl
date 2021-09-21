import YAML from 'yaml'
import fs from 'fs-extra'
import path from 'path'

const yml = fs.readFileSync(path.join(process.cwd(), 'yml.yml'), 'utf8')
console.log(yml)
const obj = parseYml(yml)
console.log(obj)

export function parseYml(yml = ''): Record<string, any> {
  return YAML.parse(yml, {
    merge: true,
    prettyErrors: true,
    schema: 'core',
    version: '1.2',
  })
}

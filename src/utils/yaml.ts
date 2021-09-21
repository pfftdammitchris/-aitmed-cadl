import YAML from 'yaml'

// import fs from 'fs-extra'
// import path from 'path'

// const yml = fs.readFileSync(path.join(process.cwd(), 'yml.yml'), 'utf8')
// console.log(yml)
// const obj = parseYml(yml)
// console.log(obj)

export function parseYml(yml = ''): Record<string, any> {
  try {
    return YAML.parse(yml, {
      logLevel: 'debug',
      prettyErrors: true,
      schema: 'failsafe',
      version: '1.2',
    })
  } catch (error) {
    console.error(error)
    return {}
  }
}

import YAML from 'yaml'

export function parseYml(yml = ''): Record<string, any> {
  return YAML.parse(yml, {
    merge: true,
    prettyErrors: true,
    schema: 'core',
    version: '1.2',
  })
}

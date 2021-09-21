import YAML from 'yaml'

export function parseYml(yml = ''): Record<string, any> {
  return YAML.parse(yml, {
    schema: 'yaml-1.1',
    prettyErrors: true,
  })
}

const fs = require('fs')
const foldersName = require('../../foldersName')

function javascript(name, capName, cb) {
  const path = `${foldersName.sourceFolder}/js/core/renderers/${capName}.ts`

  const jsPages = `${foldersName.sourceFolder}/js/core/renderers/index.ts`
  const jsContent = fs.readFileSync(jsPages, 'utf8')

  const appjs = `${foldersName.sourceFolder}/js/app.ts`
  const appjsContent = fs.readFileSync(appjs, 'utf8')

  const regex = /renderers: {(\w|\W){0,}},(\w|\W){0,}transitions/gm
  const regex2 = /(import {home).{1,}/gm
  const regex3 = /\s.{1,}},/gm

  let m
  let toReplaceString

  while ((m = regex2.exec(appjsContent)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex2.lastIndex) {
      regex2.lastIndex++
    }

    // The result can be accessed through the `m`-variable.
    toReplaceString = m[0].replace(/}/gm, `, ${name}}`)
  }

  const matched = appjsContent.match(regex)[0].replace(
    regex3,
    `,
    ${name}
  },`
  )

  const replaceMatch = appjsContent.replace(regex, matched)

  const appJSOutput = replaceMatch.replace(regex2, toReplaceString)

  fs.writeFile(
    jsPages,
    `${jsContent} \nexport const ${name} = (): Promise<any> => {
      return import(/* webpackChunkName: "${name}" */ './${capName}')
      }`,
    cb
  )
  fs.writeFile(appjs, appJSOutput, cb)

  const template = `import Highway from '@dogstudio/highway'

export default class ${capName} extends Highway.Renderer {
  
  onEnterCompleted(): void {
    console.log('Hello from ${capName}')
  }
  onLeave(): void {
    console.log('Leave from ${capName}')
  }
}`

  fs.appendFile(path, template, cb)
  return path
}

module.exports = javascript

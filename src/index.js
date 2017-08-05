'use strict'

const glob = require('glob')
const util = require('util')
const fs = require('fs')
const readFile = util.promisify(fs.readFile)
const {resolve: resolvePath, extname} = require('path')

const fm = require('front-matter')
const marked = require('marked')

// -------------------------------------------------------------
// Constants.
// -------------------------------------------------------------

const IGNORE_LIST = [
  'node_modules/**/*'
]

// -------------------------------------------------------------
// Helpers.
// -------------------------------------------------------------

const addProp =
  (prop, val) =>
    obj =>
      Object.assign({
        [prop]: val
      }, obj)

const addHtml = obj => addProp('html', marked(obj.body))(obj)

// Convert an object to an indented JSON string.
const toPrettyString = obj => JSON.stringify(obj, null, 2)

const replaceExtension = (filename, newExt) => {
  const ext = extname(filename)
  const withoutExt = filename.substring(0, filename.length - ext.length)
  return withoutExt + newExt
}

const createWriter =
  destination =>
    obj => {
      console.log(`Writing ${obj.path}`)
      fs.writeFileSync(
        resolvePath(destination, obj.path),
        toPrettyString(obj)
      )
    }

// -------------------------------------------------------------
// Module.
// -------------------------------------------------------------

function find (
  workingDirectory = process.cwd(),
  destination = process.cwd() + '/out'
) {
  const options = {
    cwd: workingDirectory,
    ignore: IGNORE_LIST
  }

  console.log(`Looking for Markdown files in ${options.cwd}…`)

  glob('**/*.md', options, (err, paths) => {
    if (err) {
      console.error('no markdown files found')
      return
    }

    Promise.all(
      paths.map(convert)
    ).then(bodies => {
      const write = createWriter(destination)
      bodies.forEach(write)

      console.log('')
      console.log('Done!')
    }).catch(() => console.error('error while writing files'))
  })
}

function convert (filename) {
  const jsonFilename = replaceExtension(filename, '.json')
  const addFilename = addProp('path', jsonFilename)

  return readFile(filename, 'utf-8')
    .then(fm)
    .then(addHtml)
    .then(addFilename)
    .catch(() => {
      console.error(`cannot process ${filename}`)
    })
}

// -------------------------------------------------------------
// Exports.
// -------------------------------------------------------------

module.exports = {find}

import test from 'ava'
import jsdomify from 'jsdomify'
import html from './fixtures'
import WordUp from '../src'

jsdomify.create(html)

const docRef = jsdomify.getDocument()
const ctx = docRef.querySelector('#content')
const Wu = new WordUp(ctx)

test('is context an array', t => {
  let elements

  elements = WordUp.contextToArray()
  t.true(Array.isArray(elements))

  elements = WordUp.contextToArray(ctx)
  t.true(Array.isArray(elements))

  elements = WordUp.contextToArray(docRef.querySelector('p'))
  t.true(Array.isArray(elements))
});

test('text content', t => {
  const text = WordUp.textContent(docRef.querySelector('#h1'))
  t.true(text === 'Header')
})

import test from 'ava'

import { addSequenceItem, runSequence } from './SequenceRunner'

// Tests are serial, because SequenceRunner uses a module level variable
// to store sequences to be run

test.serial(
  'added sequence item should be called if runSequence is called',
  async t => {
    let wasSequenceItemCalled = false
    addSequenceItem(
      () => (wasSequenceItemCalled = true),
      'This should be called'
    )
    await runSequence()
    t.true(wasSequenceItemCalled)
  }
)

test.serial(
  'sequence items after a failing sequence item should not be executed',
  async t => {
    let wasSequenceItemCalled = false
    addSequenceItem(() => {
      throw new Error('error in the sequence')
    }, 'This will fail')
    addSequenceItem(
      () => (wasSequenceItemCalled = true),
      'This should not be called'
    )
    await t.throws(runSequence)
    t.false(wasSequenceItemCalled)
  }
)

test.serial('runSequence() should empty the sequence queue', async t => {
  let sequenceItemCalledTimes = 0
  addSequenceItem(
    () => (sequenceItemCalledTimes += 1),
    'This should be called once'
  )
  await runSequence()
  await runSequence()
  t.is(sequenceItemCalledTimes, 1)
})

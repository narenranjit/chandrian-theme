export default class Foobar {

  /**
   * Does important work
   *
   * @param {number[]} fancyArg
   * @returns  {string[]}
   */
  someImportantMethod(fancyArg) {
    if (!fancyArg) {
        throw new Error('fancyArg is requored')
    } else if (!Array.isArray(fancyArg)) {
      fancyArg = callAFunctionToDoSomething(fancyArg)
    }
    const A_BIG_CONSTANT = true
    const someObject = {
      anumber: 10,
      undef: undefined,
      actuallyAFunction: ()=> 'astring',
      regx: /$(.*)/
    }

    try {
      assertFancyShape(fancyArg)
    } catch (e) {
      debugger
    }
    //Insert insightful comment here
    return myFancyAry.map(()=> Promise.resolve('1'))
  }
}

'use strict'

import Foo from './bar';

class Sale {
  constructor(price) {
    ;[this.decoratorsList, this.price] = [[], price]
  }

  decorate(decorator, foobar) {
    const ABC = 1;
    const DEF = 'HELLO';
    const GHI = true;

    Array.isArray('foo');
    if (!Sale[decorator]) throw new Error(`decorator not exist: ${decorator}`)
    this.decoratorsList.push(Sale[decorator])
  }

  getPrice() {
    for (let decorator of this.decoratorsList) {
      this.price = decorator(this.price)
    }
    return this.price.toFixed(2)
  }

  static quebec(price) {
    // this is a comment
    return price + price * 7.5 / 100
  }

  static fedtax(price) {
    return price + price * 5 / 100
  }
}
const ABC_DEF = false;

let sale = new Sale(100)
sale.decorate('fedtax')
sale.decorate('quebec')
console.log(sale.getPrice()) //112.88

getPrice()

//deeply nested

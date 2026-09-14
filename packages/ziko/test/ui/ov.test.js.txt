// ov.test.js
import { describe, it, expect, vi } from 'vitest';
import { UIElement } from 'ziko/dom';
class Ov extends UIElement{
    constructor(items){
        super({element : 'div'})
        this.append(items)
    }
    show(){
        console.log(1)
    }
    append(){
      return 1
    }
}

describe('Ov class', () => {

  it('should create an instance of Ov', () => {
    const ov = new Ov('test item');
    console.log(ov.append())
    expect(ov).toBeInstanceOf(Ov);
    expect(ov).toBeInstanceOf(UIElement);
    // expect(ov.append()).toEqual(1)
  });

//   it('should append items correctly', () => {
//     const ov = new Ov('hello');
//     // Assuming UIElement stores children in `children` or similar
//     // If not, adjust depending on actual implementation of append
//     expect(ov.children.length).toBeGreaterThan(0);
//     expect(ov.children[0]).toBe('hello');
//   });

//   it('should call show method', () => {
//     const ov = new Ov('item');

//     // Spy on console.log
//     const logSpy = vi.spyOn(console, 'log');

//     ov.show();

//     expect(logSpy).toHaveBeenCalledWith(1);

//     // Restore the spy
//     logSpy.mockRestore();
//   });

});

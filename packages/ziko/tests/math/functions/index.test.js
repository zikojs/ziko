import { cos, PI } from 'ziko/math'
import { expect, test} from 'vitest'

test('test cos with deep arguments', ()=>{
    expect(cos(0, PI/2, PI)).toEqual([1, 0, -1])
    expect(
        cos(
            0, 
            PI/2, 
            PI , 
            { a : 0, b : PI}
        )
    ).toEqual([1, 0, -1, { a : 1, b : -1}])
})
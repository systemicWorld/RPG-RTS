function _main_(){

    let testString = 
    `
    STYLWAN  WellBOT Tubing Profile
    US Patents 7155369 7231320 7240010 7403871 and Patents Pending
    Licensed to: 
    #, ID, LENGTH, CODE, 3-W, 3-T, 2-T, 1-T, UT1, UT2, OD1, OD2
     1,, 0, 0, w1, t1, 0, 0,,,,,
     2,, 0, 0, w2, t2, 0, 0,,,,,
     3,, 0, 0, w3, t3, 0, 0,,,,,
     4,, 0, 0, w4, t4, 0, 0,,,,,
     5,, 0, 0, w5, t5, 0, 0,,,,,
     6,, 0, 0, w6, t6, 0, 0,,,,,
     7,, 0, 0, w7, t7, 0, 0,,,,,
     8,, 0, 0, w8, t8, 0, 0,,,,,
     9,, 0, 0, w9, t9, 0, 0,,,,,
     10,, 0, 0, w0, t0, 0, 0,,,,,
    `

    let data = testString.split(`D2`)[1].trim()
    
    let numbers = data.split(`,`)

    let newCSV = ``
    for(i=0, w=4, t=5; i+12<numbers.length; i+=12, w+=12, t+=12){
        newCSV += numbers[i] + `,`
        newCSV += numbers[w] + `,`
        newCSV += numbers[t] + `,`
    }

    console.log(`newCSN: ${newCSV}`)
}
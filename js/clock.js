/*
Time is important to track:
energy usage / hunger levels
change from fetus > infant > adolescent > adult
day / night cycles, circadian rhythms 
lunar cycle
*/

class Clock {
	constructor() {
    this._htmlEle = document.body.querySelector("#clock") // html element
    this.days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
		this._date = new Date()
    this._year = this._date.getFullYear()
    this._day = this.days[this._date.getDay()]
    console.log(this._day)
    this._hour = this._date.getHours() // Get the hour (0-23)
    this._minute = this._date.getMinutes()
    this._seconds = this._date.getSeconds()
    this._startTime = Date.now()
	}
	// GETTERS
  get seconds(){ return this._seconds }
	// SETTERS
	// METHODS
	update() {
		console.info(`update()`)
    //this._day = this.days[this._date.getDay()]
    this._day = this.days[1]
    this._hour = this._date.getHours() // Get the hour (0-23)

    this._minute = this._date.getMinutes()
    this._seconds = this._date.getSeconds()
	}
  clockDisplay() {
    //console.info(`clockDisplay()`)
    this.update()
    let display = `${this._day} ${this._hour}:${this._minute}`
    console.info(display)
    return display
  }
  totalTime() { 
    return Date.now() - this._startTime 
  }
}
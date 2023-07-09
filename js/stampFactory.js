/**
 * This object makes stamps
 * @class
 */
class StampFactory {
	constructor(){
    this.utils = new Utilities()
    // link action names to stamp repository
    // Repository
    this._pistolFire = [`pew`, `pew!`, `bang`, `bang..`, `pop`, `pop!`]
    this._rifleFire = [`KkapowW`, `Blam`, `BANG`, `BOOM!`]
    this._stoicQuote = [
      `You have power over your mind – not outside events. Realize this, and you will find strength.`,
      `Confine yourself to the present.`,
      `When you arise in the morning, think of what a precious privilege it is to be alive – to breathe, to think, to enjoy, to love.`,
      `Accept the things to which fate binds you, and love the people with whom fate brings you together, but do so with all your heart.`,
      `The more we value things outside our control, the less control we have.`,
      `You can commit injustice by doing nothing.`,
      `Waste no more time arguing about what a good man should be. Be one.`,
      `The only wealth which you will keep forever is the wealth you have given away.`,
      `Have I been made for this, to lie under the blankets and keep myself warm?`,
      `I cannot escape death, but at least I can escape the fear of it.`,
      `Wealth is the slave of a wise man and the master of a fool.`,
      `Life, if well lived, is long enough.`,
      `He who is brave is free.`,
      `Difficulty comes from our lack of confidence.`,
      `I am not an Athenian or a Greek, but a citizen of the world.`
      ]

    this._repositoryMap = {
      'pistolFire': this._pistolFire,
      'rifleFire': this._rifleFire,
      'quotes': this._stoicQuote
    }
	}
	// GETTERS
	// SETTERS
	// METHODS
  /**
  * @param {string} action - pistolFire, rifleFire, stoicQuote
  */
  getText( action ){
    // console.log(`getText(${action})`)
    return this._repositoryMap[ action ][ this.utils.randomLowHigh( 0, (this._repositoryMap[ action ].length-1) )]
  }
}
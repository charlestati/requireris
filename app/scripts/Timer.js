class Timer {
  constructor (steps) {
    this.maxSteps = steps
    this.currentStep = 1
    this.radius = 0
    this.circumference = 2 * this.radius * Math.PI
    this.$circle = $('.circle')
    this.$circle.attr('stroke-dasharray', this.circumference + 'rem')
    this.$circle.attr('r', this.radius + 'rem')
  }

  setStep (step) {
    this.currentStep = step
    this.draw()
  }

  draw () {
    const offset = this.circumference / this.maxSteps * (this.maxSteps - this.currentStep) + 'rem'
    this.$circle.attr('stroke-dashoffset', offset)
  }

  start () {
    this.$circle.addClass('smooth')
    this.timer = setInterval(() => {
      if (this.currentStep > this.maxSteps) {
        this.currentStep = 1
      }

      this.draw()

      ++this.currentStep
    }, 1000)
  }
}

export default Timer

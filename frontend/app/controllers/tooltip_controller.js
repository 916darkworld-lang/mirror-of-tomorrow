import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["trigger", "tooltip"]

  connect() {
    this.hideAll()
  }

  show(event) {
    const trigger = event.currentTarget
    const tooltip = trigger.nextElementSibling

    if (!tooltip) return

    this.hideAll()
    tooltip.classList.add("visible")

    const rect = trigger.getBoundingClientRect()
    tooltip.style.top = `${rect.bottom + window.scrollY + 6}px`
    tooltip.style.left = `${rect.left + window.scrollX}px`
  }

  hide() {
    this.hideAll()
  }

  hideAll() {
    this.tooltipTargets.forEach(t => t.classList.remove("visible"))
  }
}

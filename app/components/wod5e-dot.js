import Component from '@glimmer/component';

export default class WoD5eDot extends Component {
    formatValue = (data) => Array(data.max ?? 5)
        .fill(0)
        .map((_, idx) => `<i class="${idx < (data.value ?? 0) ? "fa-solid" : "fa-regular"} fa-circle"></i>`)
        .join('')

    get value() { return { name: this.args.data.name, value: this.formatValue(this.args.data) } }
}
import Component from '@glimmer/component';

export default class WoD5eDot extends Component {
    formatValue = (data) => data.value ? Array(data.value).fill('0').map((_) => "O").join('') : ''

    get value() { return { name: this.args.data.name, value: this.formatValue(this.args.data) } }
}
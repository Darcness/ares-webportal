import Component from '@glimmer/component';

export default class WoD5eSheet extends Component {
    get name() { return this.args.data.name; }
    get value() { return this.args.data.value ? Array(this.args.data.value).fill('0').map((_) => "O").join('') : '' }
}
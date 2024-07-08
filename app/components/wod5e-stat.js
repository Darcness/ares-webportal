import Component from '@glimmer/component';

export default class WoD5eStat extends Component {
    get name() { return this.toSentenceCase(this.args.data.name); }
    get value() { return (typeof this.args.data.value) == 'boolean' ? (this.args.data.value ? 'YES' : 'NO') : this.args.data.value }

    toSentenceCase = (value) => value?.split(' ').map((s) => s[0].toUpperCase() + s.slice(1)).join(' ') || '';
}
import Component from '@glimmer/component';

export default class WoD5eTracker extends Component {
    formatValue = (data) =>
        '<div class="trackerBoxContainer">' +
        Array(data.max ?? 5)
            .fill('0')
            .map((_, idx) => {
                let classes = ['trackerBox'];
                if (idx < (data.agg + data.superficial)) {
                    classes.push(idx < data.agg ? "agg" : "superficial");
                }

                return `<div class="${classes.join(' ')}"></div>`;
            })
            .join('') +
        '</div>'

    get value() { return { name: this.args.data.name, value: this.formatValue(this.args.data) } }
}
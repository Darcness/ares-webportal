import Component from '@ember/component';

export default class WoD5eSheet extends Component {

    shouldShow = (data) => !!data;

    parse = (data) => JSON.parse(data);

    getType = (data) => JSON.parse(data).type;

    getPowerHeader = (data) => JSON.parse(data).powers_title;

    formatAttribs = (data) => this.column_format(this.parse(data).attribs, 3, (k, v) => ({ name: k, value: v }))

    formatSkills = (data) => this.column_format(this.parse(data).skills, 3, (k, v) => ({ name: k, value: v.value, specialties: v.specialties }))

    formatAdvantages = (data) => {
        let advantages = [];

        Object.values(this.parse(data).advantages).forEach((a) => advantages = advantages.concat([
            this.formatAdvantage(a),
            ...Object.values(a.children).map((c) => this.formatAdvantage(c, true))
        ]));

        return this.column_format_with_children(advantages);
    }

    formatAdvantage = (advantage, isChild) => ({
        name: `${isChild ? '&nbsp;&nbsp;-' : ''}${advantage.name}`,
        value: `${advantage.value}${advantage.secondary_value != 0 ? ` (${advantage.secondary_value})` : ''}`
    })

    formatEdges = (data) => {
        let edges = []

        Object.entries(this.parse(data).edges).forEach((e) => edges = edges.concat([{ name: e[0] }, ...e[1].map((p) => ({ name: `&nbsp;&nbsp;-${p}` }))]));

        return this.column_format_with_children(edges);
    }

    column_format_with_children = (items) => {
        let midpoint = Math.floor(items.length / 2) + (items.length % 2)

        // We want to keep sub-objects in the same column as their parent.
        // If the first item in the second column is a sub-object (starts with a space),
        // push forward until we find a main-line item.

        while (midpoint > 0 && midpoint < items.length && items[midpoint].name.startsWith('&nbsp;')) {
            midpoint++;
        }

        let values = []

        for (let row = 0; row < midpoint; row++) {
            values.push(items[row]);
            values.push(items[row + midpoint] ?? '');
        }

        return values;
    }

    column_format = (items, columnCount, format) => {
        let val = []

        Object.entries(items).forEach((pair, i) => {
            let size = Math.floor(Object.keys(items).length / columnCount);
            let pos = (i % size) * size + Math.floor(i / size)
            val[pos] = format(pair[0], pair[1]);
        })

        return val;
    }
}
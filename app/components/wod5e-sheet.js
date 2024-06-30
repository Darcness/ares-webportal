import Component from '@ember/component';

export default class WoD5eSheet extends Component {

    shouldShow = (data) => !!data;

    parse = (data) => JSON.parse(data)

    keys = (obj) => Object.keys(obj)

    formatAttribs = (data) => this.column_format(this.parse(data).attribs, 3, (k, v) => ({ name: k, value: v }))

    formatSkills = (data) => this.column_format(this.parse(data).skills, 3, (k, v) => ({ name: k, value: v.value, specialties: v.specialties }))

    formatAdvantages = (data) => Object.values(this.parse(data).advantages).map((obj) => ({
        ...obj,
        format_value: obj.value + obj.secondary_value ? ` ${obj.secondary_value}` : '',
        children: Object.values(obj.children).map((inner) => ({ ...inner, name: `  -${inner.name}` }))
    }))

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
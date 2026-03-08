import ChoreographyRenderer from "./ChoreographyRenderer";
import ChoreographyRules from "./ChoreographyRules";
import ChoreographyNameEditing from "./ChoreographyNameEditing";
import ChoreographyContextPad from "./ChoreographyContextPad";
import ChoreographyPalette from "./ChoreographyPalette";


export default {
    __init__: [
        'choreographyRenderer',
        'choreographyRules',
        'choreographyNameEditing',
        'choreographyContextPad',
        'choreographyPalette'
    ],
    choreographyRenderer: ['type', ChoreographyRenderer],
    choreographyRules: ['type', ChoreographyRules],
    choreographyNameEditing: ['type', ChoreographyNameEditing],
    choreographyContextPad: ['type', ChoreographyContextPad],
    choreographyPalette: ['type', ChoreographyPalette]
}

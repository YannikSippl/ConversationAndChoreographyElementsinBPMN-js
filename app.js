import BpmnJS from 'bpmn-js/lib/Modeler';
import conversationModdle from './resources/conversation-extension.json';
import ConversationModule from './features';

//needed for modeler ui
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';


// create modeler instance
var modeler = new BpmnJS({
    container: '#diagram',
    additionalModules: [
        ConversationModule //add conversation renderer to the modeler
    ],
    moddleExtensions: {
        conversation: conversationModdle //add conversation extension to the modeler
    }
});

//for testing only
window.modeler = modeler;

//load xml from file
async function getXML() {
    return await fetch('./resources/sample.bpmn')
        .then(response => { return response.text() })
};

// import xml and display diagram
async function showDiagram() {
    const xml = await getXML();
    const { warnings } = await modeler.importXML(xml);
    console.log('import warnings:', warnings);

    const eventBus = modeler.get('eventBus');

    eventBus.on('element.click', (event) => {
        const element = event.element;
        console.log('element.click:', element?.id, element?.type);
    });

    eventBus.on('selection.changed', (event) => {
        const selection = event.newSelection || [];
        console.log(
            'selection.changed:',
            selection.map(e => `${e.id} (${e.type})`)
        );
    });
}

showDiagram();



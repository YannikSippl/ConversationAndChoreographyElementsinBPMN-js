import BpmnJS from 'bpmn-js/lib/Modeler';
import conversationModdle from './resources/conversation-extension.json';
import ConversationRenderer from './features/ConversationRenderer';

//needed for modeler ui
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';


// create modeler instance
var modeler = new BpmnJS({
    container: '#diagram',
    additionalModules: [
        ConversationRenderer //add conversation renderer to the modeler
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
    await modeler.importXML(xml);
}

showDiagram();



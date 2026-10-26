import { jsx, CCProps, createState, Accessor, Setter } from "ags"
import { writeFile } from "ags/file"
import { Gtk } from "ags/gtk4"
import GLib from "gi://GLib"

// *************************
// GTK WIDGET JSX DEFINITIONS
// *************************

// Other GTK elements converted into jsx
export const CheckButton = (props: Partial<CCProps<Gtk.CheckButton, Gtk.CheckButton.ConstructorProps>>) =>
    jsx(Gtk.CheckButton, props)

export const Grid = (props: Partial<CCProps<Gtk.Grid, Gtk.Grid.ConstructorProps>>) =>
    jsx(Gtk.Grid, props)


export class Note
{
    id : number = -1
    text : string = ""
    isCompleted : boolean = false
    dateCreated : Date = new Date()
    deadline : Date = new Date()
    cmdToStart : string = ""
}

export class Tag
{
    name : string = ""
    color : string = ""
    notes : number[] = [];
}

export class NoteManager
{
    // Singleton go brr
    private static self : NoteManager
    
    public notes : Accessor<Note[]>
    private setNotes : Setter<Note[]>
    private nextNoteID : number

    //TODO: tag implementation
    //tags : Tag[]

    private constructor(_oldNotes : string) {
        const [notes, setNotes] = createState<Note[]>([])
        this.notes = notes
        this.setNotes = setNotes
        this.nextNoteID = 0

        interface jsonNote{
            text : string
            dateCreated : Date
            isCompleted : boolean
            deadline? : Date
            cmdToStart? : string
        }

        const jsonParseRes = JSON.parse(_oldNotes) as jsonNote[]
        
        jsonParseRes.forEach(data => {
            const newNote = new Note()
            newNote.id = this.nextNoteID++
            newNote.text = data.text
            newNote.dateCreated = data.dateCreated
            newNote.isCompleted = data.isCompleted
            if(data.deadline) {
                newNote.deadline = data.deadline
            }
            if(data.cmdToStart) {
                newNote.cmdToStart = data.cmdToStart
            }
            this.setNotes((prev) => [...prev, newNote])
        });

        this.notes.subscribe(() => {this.WriteNotesToConfig()})

        console.log("NoteManager initialized")
    }

    static init(_previousNoteData : string) {
        if(NoteManager.self == null) {
            NoteManager.self = new NoteManager(_previousNoteData)
            return NoteManager.self
        }
        else {
            console.log("NoteManager has already been initialized!")
        }

        return null
    }

    static get() {
        return NoteManager.self
    }

    WriteNotesToConfig()
    {
        const noteString = JSON.stringify(this.notes(), ["text", "dateCreated", "isCompleted", "deadline", "cmdToStart"], 2)
        
        const configFilePath = GLib.build_filenamev([GLib.get_user_config_dir(), "TodoWidget/notes.conf"])

        writeFile(configFilePath, noteString)
        console.log("Note changes written to file")
    }

    AddNote(_text : string) : Note {
        var newNote = new Note()
    
        newNote.id = this.nextNoteID++
        newNote.text = _text
        newNote.dateCreated = new Date()
    
        this.setNotes((prev) => [...prev, newNote])

        console.log("Note", newNote.id, "created")

        return newNote
    }
    
    RemoveNote(_note : Note) {
        const note = this.notes().find((note) => note.id == _note.id)
        if(note) {
            this.setNotes((prev) => prev.filter((note) => note.id != _note.id))
            console.log("Note", _note.id, "removed")
        }
        else {
            console.log("Could not find note to remove")
        }
    }
}
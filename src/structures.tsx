import { jsx, CCProps, createState, Accessor, Setter } from "ags"
import { Gtk } from "ags/gtk4"

// *************************
// GTK WIDGET JSX DEFINITIONS
// *************************

// Other GTK elements converted into jsx
export const CheckButton = (props: Partial<CCProps<Gtk.CheckButton, Gtk.CheckButton.ConstructorProps>>) =>
    jsx(Gtk.CheckButton, props)

export const Grid = (props: Partial<CCProps<Gtk.Grid, Gtk.Grid.ConstructorProps>>) =>
    jsx(Gtk.Grid, props)

export const Entry = (props: Partial<CCProps<Gtk.Entry, Gtk.Entry.ConstructorProps>>) =>
    jsx(Gtk.Entry, props)


export class Note
{
    id : number = -1
    text : string = ""
    cmdToStart : string = ""
    isCompleted : boolean = false
    deadline : Date = new Date()
    dateCreated : Date = new Date()
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

    //TODO: tag implementation
    //tags : Tag[]

    private constructor() {
        const [notes, setNotes] = createState<Note[]>([])
        this.notes = notes
        this.setNotes = setNotes

        console.log("NoteManager initialized")
    }

    static init() {
        if(NoteManager.self == null) {
            NoteManager.self = new NoteManager()
            return NoteManager.self
        }
        else {
            console.log("NoteManager has already been initialized!")
        }

        return null
    }

    static get() {
        if(!NoteManager.self) {
            NoteManager.init()
        }

        return NoteManager.self
    }

    AddNote(_text : string) : Note {
        var newNote = new Note()
    
        newNote.id = this.notes.length
        newNote.text = _text
        newNote.dateCreated = new Date()
    
        this.setNotes((prev) => [...prev, newNote])
    
        return newNote
    }
 
    SetDeadline(_id : number, _deadline : Date) {
        const found = this.notes().find((note) => note.id == _id)
        if(found) {
            found.deadline = _deadline
        }
    }
}
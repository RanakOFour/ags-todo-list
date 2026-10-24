import { Gtk } from "ags/gtk4"
import GObject from "gnim/gobject"
import { NoteManager, Note } from "../structures"

function AddNoteButton() {
  function AddNote(){
    
  }
  return(
    <button 
    cssClasses={["topbutton", "addnote"]}
    label="+"
    onClicked={AddNote}
    />
  )
}

export function TopBar(_noteView : GObject.Object){
  return(
    <box name="TopBar" orientation={Gtk.Orientation.HORIZONTAL} spacing={4}>
      <label label="To Do" xalign={0} hexpand />
      <button cssClasses={["TopButton"]} label="+" onClicked={() => print("add")} />
      <button cssClasses={["TopButton"]} label="F" />
      <button cssClasses={["TopButton"]} label="S" />
    </box>
  )
}
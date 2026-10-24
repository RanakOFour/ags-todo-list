import { Gtk } from "ags/gtk4"
import GObject from "gnim/gobject"

import { NewNoteEntry } from "@/notelist/noteview"

export function TopBar(setAddingNewNote : (v: boolean) => void){
  return(
    <box name="TopBar" orientation={Gtk.Orientation.HORIZONTAL} spacing={4}>
      <label label="To Do" xalign={0} hexpand />
      <button 
        cssClasses={["topbutton", "addnote"]}
        label="+"
        onClicked={() => {
          setAddingNewNote(true)
          NewNoteEntry.grab_focus()
        }}
      />
      <button cssClasses={["topbutton"]} label="F" />
      <button cssClasses={["topbutton"]} label="S" />
    </box>
  )
}
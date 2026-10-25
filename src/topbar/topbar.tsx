import { Gtk } from "ags/gtk4"

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
      <button cssClasses={["topbutton", "filter"]} label="F" />
      <button cssClasses={["topbutton", "sort"]} label="S" />
    </box>
  )
}
import { Gdk } from "ags/gtk4"

class Global<T = string> {
    private data? : T

    constructor(_default : T | null)
    {
        if(_default) {
            this.data = _default
        }
        else
        {
            this.data = (0 as T)
        }
    }

    Set(_data : T)
    {
        this.data = _data
    }

    Get()
    {
      if(this.data)
        return this.data

      return null
    }

}

// Default config because my ass is NOT handling having NOTHING
const defaultStyleConfig : string = 
`$panel:        #1e1e26;   // window background (dark grey)
$panel-raised: #2b2b37;   // entry background, slightly lighter
$outline:      #615198; // purple window outline
$accent:       #615198;
$accent-hover: #A36096;
$accent-press: #CA6FA3;
$danger:       #9B3A5C;
$danger-hover: #974A74;
$on-accent:    #08060C; // dark text on coloured pills (as in waybar)
$text:         #b0bfdc;


window{
  background: $panel;
  color: $text;
  border: 2px solid $outline;
  border-radius: 8%;
  min-width: 250px;
  min-height: 250px;
}

button.topbutton{
  background-color: $accent;
  background-image: none;
  color: $on-accent;
  min-width: 0;
  min-height: 0;
  padding: 2px 8px;
  border-radius: 10px;
	font-size: 20px;
  label { color: $text;}
}

button.topbutton:hover  { background-color: $accent-hover; }
button.topbutton:active { background-color: $accent-press; }

button.deletenote {
  padding: 0px 6px;
  margin: 0;
  outline: none;
  border: none;
  background-image: none;
  background-color: $danger;
  color: $text;
  label { font-size: 12px; padding: 0; margin: 0; min-height: 0;}
}

button.deletenote:hover  { background-color: $danger-hover; }
button.deletenote:active { background-color: $accent-press; }

checkbutton.note{
  min-height: 30px;
  border-spacing: 8px;
}

checkbutton.notetext{
  color: $text;
  border-spacing: 8px;
  padding: 2px 0px;
  label { padding-right: 28px; }
}

checkbutton.notetext check,
checkbutton.notetext:checked check {
  min-width: 16px;
  min-height: 16px;
  margin: 0;
  padding: 0;
  border: 2px solid $outline;
  border-radius: 6px;
  background-color: $panel-raised;
  background-image: none;
  box-shadow: none;
  outline: none;
  color: $on-accent;
}

checkbutton.notetext:checked check{
  background-color: $accent;
  background-image: none;
}

checkbutton.notetext.completed label{
  text-decoration: line-through;
  opacity: 0.6;
}

entry.newnote {
  min-height: 30px;
  margin-left: 24px;
  padding-left: 0px;
  background-color: $panel-raised;
  color: $text;
  border: none;
  outline: none;
  box-shadow: none;
  border-radius: 8px;
  margin-left: 24px;
  padding: 2px 0px;

  text { margin-left: 0; padding-left: 8px; }
}`

export var g_monitor = new Global<Gdk.Monitor>(null)
export var g_styleConfig = new Global<string>(defaultStyleConfig)
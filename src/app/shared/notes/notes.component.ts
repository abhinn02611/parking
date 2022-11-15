import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ACTIONS, APIS, PATHS } from 'src/app/classes/appSettings';
import { BreadcrumbLink } from '../interfaces';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  private eventsSubscription: Subscription;
  @Input() add: Observable<void>;
  @Input() type = '';
  @Input() id = '';
  @ViewChild('input') input: ElementRef;

  ac = ACTIONS;
  actions = [ACTIONS.EDIT, ACTIONS.DELETE, ACTIONS.SHARE, ACTIONS.EMAIL];
  apiMap = {
    order: {
      add: APIS.SALES.NOTE.ADD_NOTE_ORDER,
      get: APIS.SALES.NOTE.LIST_NOTE_ORDER,
      key: 'orderId'
    },
    company: {
      add: APIS.SALES.NOTE.ADD_NOTE_COMPANY,
      get: APIS.SALES.NOTE.LIST_NOTE_COMPANY,
      key: 'storeId'
    },
    contact: {
      add: APIS.SALES.NOTE.ADD_NOTE_CONTACT,
      get: APIS.SALES.NOTE.LIST_NOTE_CONTACT,
      key: 'contactId'
    }
  };

  loading = false;
  data = [];
  modalOpen = false;
  activeNote = null;
  editMode = false;
  noteContent = '';

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    this.eventsSubscription = this.add.subscribe(() => {
      this.editMode = false;
      this.modalOpen = true;
      this.noteContent = '';
      this.activeNote = null;
    });
    this.getNotesData();
  }

  openLink = (link) => {
    this.router.navigate([link]);
  }

  addNewNote = (e) => {
    
  }

  addNote = () => {

    this.sharedService.postJson(this.apiMap[this.type].add, {
      commentBy: this.sharedService.name,
      taskComment: this.noteContent,
      today: this.sharedService.getToday(),
      [this.apiMap[this.type].key]: this.id,
    })
      .subscribe((res) => {
        if (res[0].status === 'success') {
          console.log('DONE');
          this.getNotesData();
        } else {
          alert('Unable to add contact');
        }
      }, (err) => { });
  }

  getNotesData = () => {
    this.sharedService.get(this.apiMap[this.type].get + this.id + '/').subscribe(
      data => {
        this.loading = false;
        if (data[0].status === 'success') {
          this.data = data[0].result;
        }
      },
      err => {
        console.error(err);
      },
      () => console.log('done uploading')
    );
  }

  openNote = (note) => {
    this.activeNote = note;
    this.modalOpen = true;
    this.noteContent = note.comment_desc;
    this.editMode = true;
  }

  onCancel = () => {
    this.modalOpen = false;
  }



  emitAction = (action) => {

  }

  saveNote = () => {
    this.addNote();
    this.modalOpen = false;
    this.noteContent = '';
  }

  saveNoteWithNew = () => {
    this.addNote();
    this.noteContent = '';
  }

  viewAll = () => {
    this.router.navigate([PATHS.MODULE_SALES + PATHS.NOTES_LIST, this.type, this.id]);
  }

}

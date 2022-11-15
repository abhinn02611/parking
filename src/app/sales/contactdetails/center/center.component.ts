import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { APIS, PATHS } from 'src/app/classes/appSettings';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'sistem-contactdetails-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.scss']
})
export class CenterComponent implements OnInit {

  @Input() contact: any;
  @Input() tasks: any;
  @Output() editImage = new EventEmitter();
  @Output() taskAdded = new EventEmitter();

  addNotes: Subject<void> = new Subject<void>();
  addAttachment: Subject<void> = new Subject<void>();
  addTaskModelOpen = false;
  addOrderModelOpen = false;

  hideTimeout = null;


  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit() {
  }

  isArray(val): boolean { return Array.isArray(val); }

  attachmentClick = (refEl) => {
    this.addAttachment.next();
  }

  notesClick = (refEl) => {
    this.addNotes.next();
  }

  addTask = () => {
    this.addTaskModelOpen = true;
  }

  addOrder = () => {
    this.addOrderModelOpen = true;
  }

  cancelAddtask = (refresh, repen) => {
    this.addTaskModelOpen = false;
    if (refresh) {
      this.taskAdded.emit();
    }

    if (repen) {
      setTimeout(() => {
        this.addTaskModelOpen = true;
      }, 10);
    }
  }

  showAllTasks = () => {
    this.router.navigate([PATHS.MODULE_SALES + PATHS.TASK_LIST]);
  }

  cancelAddorder = (refresh, reopen) => {
    if (refresh) {
      this.taskAdded.emit();
    }
    this.addOrderModelOpen = false;
    if (reopen) {
      setTimeout(() => {
        this.addOrderModelOpen = true;
      }, 10);
    }
  }

  markCompleted = (e, id, i) => {
    e.preventDefault();
    e.stopPropagation();
    const ind = this.tasks.findIndex(a => a.sales_task_id === id);
    let nextStatus = 'Completed';
    if (this.tasks[ind].sales_task_status === 'Completed') {
      nextStatus = 'Not Started';
    }
    this.tasks[ind].sales_task_status = nextStatus;
    this.sharedService.postJson(APIS.SALES.TASK.STATUS, { taskStatus: nextStatus, taskId: id, taskAgent: this.sharedService.name })
      .subscribe((res) => {
        if (res[0].status === 'success') {
          if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
          }
          this.hideTimeout = setTimeout(() => {
            this.tasks.splice(ind, 1);
            this.hideTimeout = null;
          }, 3000);
        }
      }, (err) => { });
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from '../../classes/globals';
import dayGridPlugin from '@fullcalendar/daygrid';

import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import { SharedService } from 'src/app/shared/shared.service';
import { SalesService } from '../sales.service';
import { APIS, PATHS } from 'src/app/classes/appSettings';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'sistem-alltasks',
  templateUrl: './alltasks.component.html',
  styleUrls: ['./alltasks.component.scss'],
  providers: [Globals]
})
export class AlltasksComponent implements OnInit {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template

  loading = false;
  infoOpen = false;
  addNewModelOpen = false;
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  editId = '';
  lastDate = '';
  tags = [
    '', ''
  ];
  tasks = [];
  sortedTasks = [];
  calendarEvents: EventInput[] = [
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    events: this.calendarEvents,
    eventOverlap: true,
    eventMaxStack: 2,


    // eventOverlap: true,
    // eventMaxStack: 2,
    dayMaxEvents: 3,
    dayMaxEventRows: 3,
    editable: true,
    eventDrop: (info) => {
      console.log(info.event.end);
    },

    moreLinkClick: 'popover',
    // limit: true, // for all non-TimeGrid views
    views: {
      timeGrid: {
        eventLimit: 3 // adjust to 6 only for timeGridWeek/timeGridDay
      },
      monthGrid: {
        eventLimit: 4
      },
      weekGrid: {
        eventLimit: 2
      }

    },
    height: '100%',


    headerToolbar: {
      start: 'prev,today,next', // will normally be on the left. if RTL, will be on the right
      center: 'title',

      end: 'dayGridMonth,timeGridWeek,timeGridDay' // will normally be on the right. if RTL, will be on the left
    },
    datesSet: () => {
      //alert('s');
    },
    dateClick: (e) => {
      // alert('heello' + JSON.stringify(e).toString());
    },
    eventDidMount: (info) => {
      // let icon = '/assets/images/icons/visit_1ldpi.svg';
      console.log('info.event', info.event);
      // let colorClass = 'c_icon green';
      // if(info.event.type === 'Call' || info.event.type === 'call') {
      //   icon = '/assets/images/icons/call_1ldpi.svg';
      // }
      // if(info.event.type === 'Demo' || info.event.type === 'demo') {
      //   icon = '/assets/images/icons/call_1ldpi.svg';
      // }
      // info.el.innerHTML = '<b>info.event.id</b>';
      // info.el.title="---- s TEXT----"
    }
  };




  heading = 'All Tasks';
  domain = '';
  menuSwitchStatus: boolean = false;


  constructor(private globals: Globals, private sharedService: SharedService,
    private salesService: SalesService, private router: Router) {

  }


  ngOnInit() {
    this.menuSwitchStatus = this.globals.sidebarOpen;
    this.globals.globalVarUpdate.subscribe((status) => {
      this.menuSwitchStatus = status;
    });
    // this.calendarComponent.options.height = 400;
    this.loadAPIData();
  }

  eventClick = (e) => {
    console.log('e', e.event);
  }

  openAddNewModel = () => {
    this.editId = '';
    this.addNewModelOpen = true;
  }


  cancelAddNew = (refress, reopen) => {
    if (refress) {
      this.loadAPIData();
    }
    this.addNewModelOpen = false;
    if (reopen) {
      setTimeout(() => {
        this.addNewModelOpen = true;
      }, 10);
    }
  }

  toggleInfo = () => {
    this.infoOpen = !this.infoOpen;
  }

  loadAPIData = () => {
    this.loading = true;
    this.sharedService.postJson(APIS.SALES.TASK.LIST, {
      loginId: this.salesService.getUserId(),
      loginRole: this.salesService.getUserRole()
    }).subscribe(
      data => {
        this.loading = false;
        if (data[0].status === 'success') {
          this.tasks = data[0].personalTask;
          this.tasks = this.tasks.filter(a => a.sales_task_status !== 'Completed');
          this.sortedTasks = this.filterTasks(this.tasks);
          this.calendarEvents = [];
          for (const task of this.tasks) {
            const date = task.sales_task_due_date.replace('Z', '');
            const title = task.sales_task_subject;
            let color = '#4CD964';
            if (task.sales_task_type === 'Call' || task.sales_task_type === 'call') {
              color = '#FF9500';
            }
            if (task.sales_task_type === 'Demo' || task.sales_task_type === 'demo') {
              color = '#007AFF';
            }
            const taskElement = {
              title, start: new Date(date),
              id: task.sales_task_id,
              type: task.sales_task_type,
              color
            };
            this.calendarEvents.push(taskElement);
          }
          this.tags[0] = this.tasks.length + ' items';
          this.calendarComponent.options.events = this.calendarEvents;
          this.calendarComponent.options.eventMaxStack = 4;
          this.calendarComponent.options.eventClick = (info) => {
            this.openTask(info.event.id);
            // change the border color just for fun
            info.el.style.borderColor = 'red';
          }
        }
      },
      err => {
        this.loading = false;
        console.error(err);
      },
      () => console.log('done loading domain')
    );
  }

  switchMenu = (status) => {
    this.menuSwitchStatus = status;
  }


  toggleVisible() {
    this.calendarVisible = !this.calendarVisible;
  }

  toggleWeekends() {
    this.calendarWeekends = !this.calendarWeekends;
  }

  gotoPast() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate('2000-01-01'); // call a method on the Calendar object
  }

  handleDateClick(arg) {
    if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
      this.calendarEvents = this.calendarEvents.concat({ // add new event data. must create new array
        title: 'New Event',
        start: arg.date,
        allDay: arg.allDay
      })
    }
  }

  filterTasks = (tasks) => {
    const today = moment().format('YYYY-MM-DD');
    const taskDateGroup = [];
    tasks.map((task) => {
      let dueDateYMD = (task.sales_task_due_date.split('T'))[0];
      if (task.sales_task_status === 'Not Started') {
        if (dueDateYMD < today) {
          dueDateYMD = today;
        }
        if (!taskDateGroup[dueDateYMD]) {
          taskDateGroup[dueDateYMD] = [];
        }
        taskDateGroup[dueDateYMD].push(task);
      }
    });
    const allDates = Object.keys(taskDateGroup);
    const sortedDates = allDates.sort((a, b) => a > b ? 1 : -1);
    const sortedDatesObj = [];
    sortedDates.map(a => {
      sortedDatesObj[a] = taskDateGroup[a];
    });
    return sortedDatesObj;
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
          setTimeout(() => {
            this.loadAPIData();
          }, 3000);
        }
      }, (err) => { });
  }

  openTask = (id) => {
    this.router.navigate([PATHS.MODULE_SALES + PATHS.TASK_DETAILS + id]);
  }

  formatDate = dt => moment(dt.replace('Z', '')).format('hh:mm a');

  isDateDifferent = (dt) => {
    if (dt !== this.lastDate) {
      this.lastDate = dt;
      return true;
    } else {
      return false;
    }
  }

  todayTomorrow = (dt) => {
    const date = moment(dt.replace('Z', ''));
    const today = moment();
    const tomorrow = moment().add(1, 'day');
    const yesterday = moment().add(-1, 'day');
    if (date.format('DD MMM YY') === yesterday.format('DD MMM YY')) { return 'Yesterday'; }
    if (date.format('DD MMM YY') === today.format('DD MMM YY')) { return 'Today'; }
    if (date.format('DD MMM YY') === tomorrow.format('DD MMM YY')) { return 'Tomorrow'; }
    return date.format('ddd DD MMM YY');

  }

  getKeys = (k) => Object.keys(k);


}

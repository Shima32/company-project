  import { Component, OnInit, ViewChild } from '@angular/core';
  import { NgForm } from '@angular/forms';
  import { Subscription } from 'rxjs';
  import { Company } from '../company.model';
  import { CompanyProjectService } from '../companyProject.service';
  import { Project } from '../project.model';
  import { Task } from '../task.model';
  import { AngularFirestore } from '@angular/fire/compat/firestore';

  @Component({
    selector: 'app-project-form',
    templateUrl: './project-form.component.html',
    styleUrls: ['./project-form.component.css']
  })
  export class ProjectFormComponent implements OnInit {
    @ViewChild('f') form: NgForm;
    companies: Company[];
    projects: Project[];
    tasks: Task[];
    companiesSubscription: Subscription;
    projectsSubscription: Subscription;
    tasksSubscription: Subscription;
    projectId: string;
    taskId: string;
    data: any;
    selectedCompany: string = "--Choose Company--";
    selectedCompanyProjects: Array<string>;
    selectedProjectTasks: Array<string>;
    comprojects: Project[];
    proTasks: Task[];

    constructor(private comProServic: CompanyProjectService, private db:AngularFirestore) { }

    ngOnInit() {
      this.companiesSubscription = this.comProServic.companiesChanged
      .subscribe(companies => ( this.companies = companies))
      this.comProServic.fetchAvailableCompanies();

      this.projectsSubscription = this.comProServic.projectsChanged
      .subscribe(projects => ( this.projects = projects))
      this.comProServic.fetchAvailableProjects();

      this.tasksSubscription = this.comProServic.tasksChanged
      .subscribe(tasks => ( this.tasks = tasks))
      this.comProServic.fetchAvailableTasks();

    }

    checkCompanyDropdown($event:any){
      this.comprojects = this.projects.filter(p => p.companyId === $event)
      let pItem=this.comprojects[0];
      this.form.controls['project'].setValue('');
      this.form.controls['project'].setValue(pItem.id);
      console.log($event) //company ID
      console.log(pItem.id) //project ID
  
      
      this.proTasks = this.tasks.filter(t => t.projectId === pItem.id)
      let tItem=this.proTasks[0];
      this.form.controls['task'].setValue('');
      this.form.controls['task'].setValue(tItem.id);
      console.log(tItem.id) //task ID

    }

    checkProjectDropdown($event:any){
      this.proTasks = this.tasks.filter(t => t.projectId === $event)
      let item=this.proTasks[0];
      this.form.controls['task'].setValue(item.id);
      console.log($event)
    }



  onSelectCompany(form: NgForm){
  this.comProServic.selectCompanies(form.value.company);
  }

  onAddNewRecord(form: NgForm){
    this.projectId = (this.comProServic.selectProjects(form.value.project)).id;
    this.taskId = (this.comProServic.selectTasks(form.value.task)).id;
    let data ={
      projectId: this.projectId,
      taskId: this.taskId,
      hour: form.value.hour
    }
    console.log(data)
    this.db.collection('record').add(data);
  }


  onSelectProject(form: NgForm){
    this.comProServic.selectProjects(form.value.project);
    }


  onSelectTask(form: NgForm){
    this.comProServic.selectTasks(form.value.task);
    }
    
  ngOnDestroy() {
    
    this.companiesSubscription.unsubscribe();
    this.projectsSubscription.unsubscribe();
    this.tasksSubscription.unsubscribe();
  }
    }

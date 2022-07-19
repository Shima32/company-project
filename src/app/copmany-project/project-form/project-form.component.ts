import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Company } from '../company.model';
import { CompanyProjectService } from '../companyProject.service';
import { Project } from '../project.model';
import { Task } from '../task.model';
import { Record } from '../record.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
 export class ProjectFormComponent implements OnInit {

  companies: Company[];
  projects: Project[];
  tasks: Task[];
  companiesSubscription: Subscription;
  projectsSubscription: Subscription;
  tasksSubscription: Subscription;
  projectId: string;
  taskId: string;

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



onSelectCompany(form: NgForm){
this.comProServic.selectCompanies(form.value.company);
}

// onComposeNewRecord(form: NgForm){
//   this.projectId = (this.comProServic.selectProjects(form.value.project)).id;
//   this.taskId = (this.comProServic.selectTasks(form.value.task)).id;
//   let data ={
//     projectId: this.projectId,
//     taskId: this.taskId,
//     hour: form.value.hour
//   }
//   return data;
// }

onAddNewRecord(form: NgForm){
  this.projectId = (this.comProServic.selectProjects(form.value.project)).id;
  this.taskId = (this.comProServic.selectTasks(form.value.task)).id;
  let data ={
    projectId: this.projectId,
    taskId: this.taskId,
    hour: form.value.hour
  }
  console.log("*****************************************")
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

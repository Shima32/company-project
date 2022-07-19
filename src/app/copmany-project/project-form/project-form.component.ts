import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Company } from '../company.model';
import { CompanyProjectService } from '../companyProject.service';
import { Project } from '../project.model';
import { Task } from '../task.model';

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

   constructor(private comProServic: CompanyProjectService) { }

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

  onAddNewRecord(form: NgForm){
   this.comProServic.addDataToDatabase(form.value.record)
  }

onSelectCompany(form: NgForm){
this.comProServic.selectCompanies(form.value.company);
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

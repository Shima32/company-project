import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Subscription } from "rxjs";

import { Data } from "@angular/router";
import { combineLatest, of, Subject } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import {uniq} from 'lodash';

import { Company } from "./company.model";
import { Project} from "./project.model";
import {Task} from "./task.model"
import {Record} from "./record.model"
import { UIService } from "../shared/ui.service";
 
@Injectable()

export class CompanyProjectService {

    private fbSubs: Subscription[]=[];

    companyChanged = new Subject<Company>;
    companiesChanged = new Subject<Company[]>;
    private availableCompanies: Company[] = [];
    private selectedCompany: Company ;

    projectChanged = new Subject<Project>;
    projectsChanged = new Subject<Project[]>;
    private availableProjects: Project[] = [];
    private selectedProject: Project;

    taskChanged = new Subject<Task>;
    tasksChanged = new Subject<Task[]>;
    private availableTasks: Task[] = [];
    private selectedTask: Task;


    availableData: any[]=[];
    dataChanged =  new Subject;
    
     constructor(private db:AngularFirestore, private uiService: UIService){}

    fetchAvailableCompanies() {
        this.fbSubs.push(this.db
       .collection('company')
        .snapshotChanges()
        .pipe(map(docArray => {
        return docArray.map(doc => {
            return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data() as Company
            };
        })
        }))
        .subscribe((companies: Company[]) => {
            this.availableCompanies = companies;
            this.companiesChanged.next([...this.availableCompanies])
        }))
    }

fetchAvailableProjects() {
  this.fbSubs.push(this.db
   .collection('project')
    .snapshotChanges()
    .pipe(map(docArray => {
    return docArray.map(doc => {
        return {
        id: doc.payload.doc.id,
        ...doc.payload.doc.data() as Project
        };
    })
    }))
    .subscribe((projects: Project[]) => {
        this.availableProjects = projects;
        this.projectsChanged.next([...this.availableProjects])
    }))
}

fetchAvailableTasks() {
    this.fbSubs.push (this.db
   .collection('task')
    .snapshotChanges()
    .pipe(map(docArray => { 
    return docArray.map(doc => {
        return {
        id: doc.payload.doc.id,
        ...doc.payload.doc.data() as Task
        };
    })
    }))
    .subscribe((projects: Task[]) => {
        this.availableTasks = projects;
        this.tasksChanged.next([...this.availableTasks])
    }))
}



selectCompanies(selectedId: string) {

    this.selectedCompany = <Company>this.availableCompanies.find(
        ex => ex.id === selectedId);
    this.companyChanged.next({ ...this.selectedCompany});
}

selectProjects(selectedId: string) {

    this.selectedProject = <Project>this.availableProjects.find(
        ex => ex.id === selectedId);
    this.projectChanged.next({ ...this.selectedProject});
    return this.selectedProject;
}
   
    
    selectTasks(selectedId: string) {

        this.selectedTask = <Task>this.availableTasks.find(
            ex => ex.id === selectedId);
        this.taskChanged.next({ ...this.selectedTask});
        return this.selectedTask;
    }

    // retriving data can apply for all collection but it has some defect.
    //  addDataToDatabase (newRecord: Record ) {
    //     this.db.collection('record').add(newRecord);
    // }

    // fetchAvailableData(collectionName: string) {
    //     this.db
    //    .collection(collectionName)
    //     .snapshotChanges()
    //     .pipe(map(docArray => {
    //     return docArray.map(doc => {
    //         return {
    //         id: doc.payload.doc.id,
    //         ...doc.payload.doc.data() as any
    //         };
    //     })
    //     }))
    //     .subscribe((companies: Company[]) => {
    //         this.availableData = companies;
    //         this.companiesChanged.next([...this.availableData])
    //     })
    // } 

    cancelSubscription(){
        this.fbSubs.forEach( sub => sub.unsubscribe());
    }

 }
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Data } from "@angular/router";
import { combineLatest, Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Company } from "./company.model";
import { Project} from "./project.model";
import {Task} from "./task.model"
import {Record} from "./record.model"
 
@Injectable()

export class CompanyProjectService {

    companyChanged = new Subject<Company>;
    companiesChanged = new Subject<Company[]>;
    ///////
  finishedExercisesChanged = new Subject<Company[]>;
  ////////////////
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


    
     constructor(private db:AngularFirestore){}

    fetchAvailableCompanies() {
        this.db
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
        })
    }

    selectCompanies(selectedId: string) {

        this.selectedCompany = <Company>this.availableCompanies.find(
            ex => ex.id === selectedId);
        this.companyChanged.next({ ...this.selectedCompany});
    }

////////////////////////////////////////////////////////

fetchAvailableProjects() {
    this.db
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
    })
}

selectProjects(selectedId: string) {

    this.selectedProject = <Project>this.availableProjects.find(
        ex => ex.id === selectedId);
    this.projectChanged.next({ ...this.selectedProject});
    return this.selectedProject;
}
    //////////////////////////////////////////////////////
   
    fetchAvailableTasks() {
        this.db
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
        })
    }

    selectTasks(selectedId: string) {

        this.selectedTask = <Task>this.availableTasks.find(
            ex => ex.id === selectedId);
        this.taskChanged.next({ ...this.selectedTask});
        return this.selectedTask;
    }

//     completeExercise() {
//         this.addDataToDatabase({...this.runningExercise,
//              date: new Date(),
//              state: 'completed' }); 
//         this.runningExercise = null;
//         this.exercisChanged.next(null);
//     }

//     cancelExercise(progress: number) {
//         this.addDataToDatabase({...this.runningExercise,
//             duration: this.runningExercise.duration * (progress / 100),
//             calories: this.runningExercise.calories * (progress/100) ,
//             date: new Date(),
//             state: 'cancelled' }); 
//         this.runningExercise = null;
//         this.exercisChanged.next(null);

//     }

//     getRunningExercise() {
//         return { ...this.runningExercise };
//     }

    fetchCompletedOrCancelledExercises() {
        this.db.collection('company').valueChanges()
        .subscribe((companies: Company[]) => {
            this.finishedExercisesChanged.next(companies);
        })
    }

     addDataToDatabase (newRecord: Record ) {
        this.db.collection('record').add(newRecord);
    }

    deleteRecord(recordId:string){
        // this.db.collection('record').doc.apply.
    }
 }
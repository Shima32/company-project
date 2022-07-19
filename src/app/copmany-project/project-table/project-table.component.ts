import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Subscription,of, Observable, from } from 'rxjs';
import { Company } from '../company.model';
import { Record } from '../record.model';
import { Task} from '../task.model';
import { CompanyProjectService } from '../companyProject.service';
import { Project } from '../project.model';
import { switchMap, map } from 'rxjs/operators';
import {uniq} from 'lodash';



@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.css']
})
export class ProjectTableComponent implements OnInit {
  displayedColumns = ['companyName', 'projectName', 'taskName', 'estimatedTime', 'action'];
  companyDataSource = new MatTableDataSource<Company>();
  projectDataSource = new MatTableDataSource<Project>();
  private companiesSubscription: Subscription;
  private projectsSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  companies: Company[];
  projects: Project[];
  tasks: Task[];

  dataSource = new MatTableDataSource<any>();
  //////////////////////////////////////
  showSeparate: boolean;
  showSameTime: boolean;

  companies$: Observable<Company[]>;
  projects$: Observable<Project[]>;

  all$: Observable<{companies: Company[]; projects: Project[]}>;

  joined$: Observable<any>;

  ////////////////////////////////////////

  constructor(private comProServic: CompanyProjectService, private db:AngularFirestore) { }

  ngOnInit() {
    //------------------------
    // this.companiesSubscription = this.comProServic.companiesChanged
    // .subscribe((companies: Company[]) => {
    //   this.companyDataSource.data = companies;
    //   console.log(companies)
    // })

    // this.projectsSubscription = this.comProServic.projectsChanged
    // .subscribe((projects: Project[]) => {
    //   this.projectDataSource.data = projects;
    //   console.log(projects)
    // })
    ///////////////////connect project and company
    this.db
    .collection<Project>('project')
    .valueChanges()
    .pipe(
      switchMap( projects =>{
        const companyIds = uniq(projects.map(pro => pro.companyId));
        console.log(companyIds)

        return  combineLatest([
          of(projects),
             
          combineLatest(
          companyIds.map(companyId =>
           this.db.collection<Company>('company', ref => ref.where('id', '==', companyId))
           .valueChanges().pipe(
             map(companies => companies[0]
               )
           )
           )
       )
        ])
      }),
      map(([projects, companies]) =>{
        return projects.map(project => {
          return {
            ...project,
            company: companies.find( a =>a.id === project.companyId)
          }
        })
      }

      )
      
    ).subscribe(data => {
      this.dataSource.data = data;
      console.log(data);
    })
/// ---------------- record + task + project
    // this.db
    // .collection<Record>('record')
    // .valueChanges()
    // .pipe(
    //   switchMap( records =>{
    //     const taskIds = uniq(records.map(pro => pro.taskId));
    //     const projectIds = uniq(records.map(pro => pro.projectId));
    //     console.log(projectIds);
    //     console.log(taskIds);

    //     return  combineLatest(
    //           of(records),  

    //          combineLatest(
    //           taskIds.map(taskId =>
    //           this.db.collection<Task>('task', ref => ref.where('id', '==', taskId))
    //           .valueChanges().pipe(
    //             map(tasks => tasks[0]
    //               )
    //           )
    //           )
    //       ),

    //       combineLatest( 
    //         projectIds.map(projectId =>
    //         this.db.collection<Project>('project', ref => ref.where('id', '==', projectId))
    //         .valueChanges().pipe(
    //           map(projects => projects[0]
    //             )
    //         )
    //         )
    //     )
    //    )
    //   }),

    //   map(([records,tasks,projects]) =>{
    //     console.log(records);
    //     return records.map(record => {
    //       return {
    //         ...record,
    //         task: tasks.find( t =>t.id === record.taskId),
    //         project: projects.find( p =>p.id === record.projectId)
    //       }
    //     })
    //   }
    //   )
      
    // ).subscribe(data => {
    //   this.dataSource.data = data;
    //   console.log(data);
    // })
    }
///////////////////////////////end of ngOnInit


ngAfterViewInit(){
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator; 
}
doFilter(filterValue: string){
this.dataSource.filter =filterValue.trim().toLowerCase();
}

ngOnDestroy() {
  this.companiesSubscription.unsubscribe();
  this.projectsSubscription.unsubscribe();
}

}



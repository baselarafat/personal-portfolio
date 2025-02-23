import React from "react";
import '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../assets/styles/Timeline.scss';

function Timeline() {
  return (
    <div id="history">
      <div className="items-container">
        <h1>Career History</h1>
        <VerticalTimeline>
          {/* Computer Science Instructor */}
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'white', color: 'rgb(39, 40, 34)' }}
            contentArrowStyle={{ borderRight: '7px solid white' }}
            date="August 2021 - July 2023"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Computer Science Instructor</h3>
            <h4 className="vertical-timeline-element-subtitle">Saddle River Day School, Saddle River, NJ</h4>
            <p>
              Developed and taught courses in advanced programming (CSS, HTML, Python, Java, and JavaScript).  
              Introduced AI/NLP modules, and fostered strong relationships with students, enhancing their learning experience.
            </p>
          </VerticalTimelineElement>

          {/* Mathematics Teacher */}
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="August 2020 - June 2021"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Mathematics Teacher</h3>
            <h4 className="vertical-timeline-element-subtitle">Christchurch School, Saluda, VA</h4>
            <p>
              Designed and implemented Algebra 1 and Geometry curriculum aligned with Common Core State Standards.  
              Utilized differentiated instruction to meet diverse learning needs and improve student outcomes.
            </p>
          </VerticalTimelineElement>

          {/* Collaborator */}
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="April 2018 - May 2020"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Collaborator</h3>
            <h4 className="vertical-timeline-element-subtitle">Dept. of Math & Computer Science, University of Richmond</h4>
            <p>
              Collaborated on the launch of the first website dedicated to American Mathematics.  
              Acted as a technical advisor to a group of 30+ students and a professor, ensuring a successful project rollout.
            </p>
          </VerticalTimelineElement>

          {/* Student Manager */}
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="September 2016 - May 2020"
            iconStyle={{ background: '#5000ca', color: 'rgb(39, 40, 34)' }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            <h3 className="vertical-timeline-element-title">Student Manager</h3>
            <h4 className="vertical-timeline-element-subtitle">Technology Learning Center, University of Richmond</h4>
            <p>
              Recruited for and facilitated the expansion of the Technology Learning Center.  
              Led a team of 20+ students to provide excellent customer service, increasing client service efficiency by 25%.
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>
    </div>
  );
}

export default Timeline;
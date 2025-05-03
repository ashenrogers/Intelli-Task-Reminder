import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';
import { 
  FiDownload, 
  FiFilter, 
  FiSearch, 
  FiUsers, 
  FiX,
  FiMap,
  FiBarChart2,
  FiFileText
} from 'react-icons/fi';

// Import jsPDF and jspdf-autotable correctly
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './profiles.css';

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    skills: [],
    location: '',
    experience: 'all' // 'all', 'beginner', 'intermediate', 'expert'
  });
  const [reportType, setReportType] = useState('summary');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  // Extract all unique skills and locations for filter options
  const allSkills = [...new Set(profiles.flatMap(profile => 
    (profile.skills && Array.isArray(profile.skills)) ? profile.skills : []
  ))];
  const allLocations = [...new Set(profiles.map(profile => profile.location).filter(Boolean))];

  const filteredProfiles = profiles.filter((profile) => {
    // Search term filtering
    const nameMatch = profile.user && profile.user.name && 
                     profile.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = profile.location && profile.location.toLowerCase().includes(searchTerm.toLowerCase());
    const skillsMatch = profile.skills && Array.isArray(profile.skills) && profile.skills.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const searchMatch = nameMatch || locationMatch || skillsMatch;
    if (!searchMatch) return false;
    
    // Additional filters
    const locationFilterMatch = !filters.location || 
      (profile.location && profile.location.toLowerCase() === filters.location.toLowerCase());
    
    const skillsFilterMatch = filters.skills.length === 0 || 
      (profile.skills && Array.isArray(profile.skills) && filters.skills.every(skill => 
        profile.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      ));
    
    // Experience level filtering (this would need to be added to your profile model)
    const experienceMatch = filters.experience === 'all' || 
      (profile.experienceLevel && profile.experienceLevel === filters.experience);
    
    return locationFilterMatch && skillsFilterMatch && experienceMatch;
  });

  const toggleSkillFilter = (skill) => {
    if (filters.skills.includes(skill)) {
      setFilters({
        ...filters,
        skills: filters.skills.filter(s => s !== skill)
      });
    } else {
      setFilters({
        ...filters,
        skills: [...filters.skills, skill]
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      skills: [],
      location: '',
      experience: 'all'
    });
    setSearchTerm('');
  };

  const generatePdfReport = () => {
    setIsGeneratingReport(true);
    
    try {
      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add report header
      doc.setFontSize(22);
      doc.setTextColor(108, 99, 255); // Primary color: #6c63ff
      doc.text("Developer Network Report", pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80); // Dark grey
      doc.text(`Generated on: ${new Date().toLocaleDateString()} - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, pageWidth / 2, 30, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50); // Darker grey
      doc.text(`Found ${filteredProfiles.length} Users matching your search criteria`, pageWidth / 2, 40, { align: 'center' });
      
      // Add different content based on report type
      if (reportType === 'summary') {
        // Skills distribution
        const skillsCount = {};
        filteredProfiles.forEach(profile => {
          if (profile.skills && Array.isArray(profile.skills)) {
            profile.skills.forEach(skill => {
              skillsCount[skill] = (skillsCount[skill] || 0) + 1;
            });
          }
        });
        
        // Sort skills by count (descending)
        const sortedSkills = Object.entries(skillsCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10); // Get top 10 skills
        
        doc.setFontSize(16);
        doc.text("Top Skills Distribution", 14, 60);
        
        // Create skills table
        const skillsTableData = sortedSkills.map(([skill, count]) => 
          [skill, count, `${Math.round((count / filteredProfiles.length) * 100)}%`]
        );
        
        // Use autoTable function directly
        autoTable(doc, {
          startY: 65,
          head: [['Skill', 'Count', 'Percentage']],
          body: skillsTableData,
          theme: 'grid',
          headStyles: { fillColor: [108, 99, 255] },
          alternateRowStyles: { fillColor: [240, 242, 255] }
        });
        
        // Locations distribution
        const locationsCount = {};
        filteredProfiles.forEach(profile => {
          if (profile.location) {
            locationsCount[profile.location] = (locationsCount[profile.location] || 0) + 1;
          }
        });
        
        // Sort locations by count (descending)
        const sortedLocations = Object.entries(locationsCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10); // Get top 10 locations
        
        // Get the final Y position from the last table
        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 65;
        
        doc.setFontSize(16);
        doc.text("Top Locations Distribution", 14, finalY + 20);
        
        // Create locations table
        const locationsTableData = sortedLocations.map(([location, count]) => 
          [location, count, `${Math.round((count / filteredProfiles.length) * 100)}%`]
        );
        
        // Use autoTable function directly
        autoTable(doc, {
          startY: finalY + 25,
          head: [['Location', 'Count', 'Percentage']],
          body: locationsTableData,
          theme: 'grid',
          headStyles: { fillColor: [108, 99, 255] },
          alternateRowStyles: { fillColor: [240, 242, 255] }
        });
        
        // Add footer and save
        finalizePdf(doc, pageWidth, reportType);
      } else if (reportType === 'detailed') {
        // Create detailed table with developer information
        const tableData = filteredProfiles.map(profile => [
          profile.user?.name || 'Unknown',
          profile.status || '',
          profile.location || 'Not specified',
          profile.skills && Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
          profile.company || ''
        ]);
        
        // Use autoTable function directly
        autoTable(doc, {
          startY: 50,
          head: [['Name', 'Status', 'Location']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [108, 99, 255] },
          alternateRowStyles: { fillColor: [240, 242, 255] },
          columnStyles: {
            3: { cellWidth: 'auto' }
          },
          styles: { overflow: 'linebreak' }
        });
        
        // Add footer and save
        finalizePdf(doc, pageWidth, reportType);
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("There was an error generating the PDF. Please try again.");
      setIsGeneratingReport(false);
    }
  };
  
  // Helper function to finalize and save PDF
  const finalizePdf = (doc, pageWidth, reportType) => {
    // Add footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`User Network - Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }
    
    // Get the current user name if available from Redux store
    const userName = profiles.length > 0 && profiles[0]?.user?.name 
      ? profiles[0].user.name.replace(/\s+/g, '-').toLowerCase() 
      : 'user';
    
    // Save the PDF with user name included
    doc.save(`${userName}-developer-network-report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    setIsGeneratingReport(false);
  };

  const exportCsv = () => {
    setIsGeneratingReport(true);
    
    try {
      // Create CSV header
      let csvContent = "Name,Title,Location,Skills,Company\n";
      
      // Add data rows
      filteredProfiles.forEach(profile => {
        const row = [
          `"${profile.user && profile.user.name ? profile.user.name : 'Unknown'}"`,
          `"${profile.status || ''}"`,
          `"${profile.location || ''}"`,
          `"${(profile.skills && Array.isArray(profile.skills)) ? profile.skills.join(', ') : ''}"`,
          `"${profile.company || ''}"`
        ];
        csvContent += row.join(',') + '\n';
      });
      
      // Get the current user name if available from Redux store
      const userName = profiles.length > 0 && profiles[0]?.user?.name 
        ? profiles[0].user.name.replace(/\s+/g, '-').toLowerCase() 
        : 'user';
      
      // Create download link
      const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${userName}-dev-network-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("CSV export error:", error);
      alert("There was an error exporting the CSV. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Combined PDF report generation
  const generateCombinedPdfReport = () => {
    setIsGeneratingReport(true);
    
    try {
      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Add report header
      doc.setFontSize(22);
      doc.setTextColor(108, 99, 255); // Primary color: #6c63ff
      doc.text("Developer Network Report", pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80); // Dark grey
      doc.text(`Generated on: ${new Date().toLocaleDateString()} - Complete Report`, pageWidth / 2, 30, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50); // Darker grey
      doc.text(`Found ${filteredProfiles.length} Users matching your search criteria`, pageWidth / 2, 40, { align: 'center' });
      
      // PART 1: Summary Section
      doc.setFontSize(18);
      doc.setTextColor(108, 99, 255);
      doc.text("PART 1: SUMMARY ANALYSIS", 14, 55);
      
      // Skills distribution
      const skillsCount = {};
      filteredProfiles.forEach(profile => {
        if (profile.skills && Array.isArray(profile.skills)) {
          profile.skills.forEach(skill => {
            skillsCount[skill] = (skillsCount[skill] || 0) + 1;
          });
        }
      });
      
      // Sort skills by count (descending)
      const sortedSkills = Object.entries(skillsCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Get top 10 skills
      
      doc.setFontSize(16);
      doc.setTextColor(50, 50, 50);
      doc.text("Top Skills Distribution", 14, 65);
      
      // Create skills table
      const skillsTableData = sortedSkills.map(([skill, count]) => 
        [skill, count, `${Math.round((count / filteredProfiles.length) * 100)}%`]
      );
      
      // Use autoTable function directly
      autoTable(doc, {
        startY: 70,
        head: [['Skill', 'Count', 'Percentage']],
        body: skillsTableData,
        theme: 'grid',
        headStyles: { fillColor: [108, 99, 255] },
        alternateRowStyles: { fillColor: [240, 242, 255] }
      });
      
      // Locations distribution
      const locationsCount = {};
      filteredProfiles.forEach(profile => {
        if (profile.location) {
          locationsCount[profile.location] = (locationsCount[profile.location] || 0) + 1;
        }
      });
      
      // Sort locations by count (descending)
      const sortedLocations = Object.entries(locationsCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Get top 10 locations
      
      // Get the final Y position from the last table
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 70;
      
      doc.setFontSize(16);
      doc.text("Top Locations Distribution", 14, finalY + 20);
      
      // Create locations table
      const locationsTableData = sortedLocations.map(([location, count]) => 
        [location, count, `${Math.round((count / filteredProfiles.length) * 100)}%`]
      );
      
      // Use autoTable function directly
      autoTable(doc, {
        startY: finalY + 25,
        head: [['Location', 'Count', 'Percentage']],
        body: locationsTableData,
        theme: 'grid',
        headStyles: { fillColor: [108, 99, 255] },
        alternateRowStyles: { fillColor: [240, 242, 255] }
      });
      
      // PART 2: Detailed Section - start on a new page
      doc.addPage();
      
      doc.setFontSize(18);
      doc.setTextColor(108, 99, 255);
      doc.text("PART 2: DETAILED USERS INFORMATION", 14, 20);
      
      // Create detailed table with developer information
      const tableData = filteredProfiles.map(profile => [
        profile.user?.name || 'Unknown',
        profile.status || '',
        profile.location || 'Not specified',
        profile.skills && Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
        profile.company || ''
      ]);
      
      // Use autoTable function directly
      autoTable(doc, {
        startY: 30,
        head: [['Name', 'Status', 'Location', 'Skills', 'Company']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [108, 99, 255] },
        alternateRowStyles: { fillColor: [240, 242, 255] },
        columnStyles: {
          3: { cellWidth: 'auto' }
        },
        styles: { overflow: 'linebreak' }
      });
      
      // Add footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`Developer Network - Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }
      
      // Get the current user name if available from Redux store
      const userName = profiles.length > 0 && profiles[0]?.user?.name 
        ? profiles[0].user.name.replace(/\s+/g, '-').toLowerCase() 
        : 'user';
      
      // Save the PDF with user name included
      doc.save(`${userName}-developer-network-complete-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("There was an error generating the PDF. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <Fragment>
      {loading ? (
        <div className="loading-container">
          <Spinner />
        </div>
      ) : (
        <div className="profiles-container">
          <div className="page-header">
            <h1><FiUsers className="header-icon" /> User Network</h1>
            <p className="subtitle">Connect with talented professionals in your society</p>
          </div>

          <div className="action-bar">
            <div className="search-filter-group">
              <div className="search-box-container">
                <FiSearch className="search-icon" />
                <input 
                  type="text" 
                  className="search-box" 
                  placeholder="Search by name, skills, or location..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="clear-search" onClick={() => setSearchTerm('')}>
                    <FiX />
                  </button>
                )}
              </div>
              
              <button 
                className={`filter-toggle-btn ${filterMenuOpen ? 'active' : ''}`} 
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              >
                <FiFilter /> Filter
              </button>
              
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="report-actions">
              <button 
                className="generate-report-btn" 
                onClick={generateCombinedPdfReport}
                disabled={isGeneratingReport}
                style={{ 
                  marginRight: '10px',
                  backgroundColor: '#6c63ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FiFileText /> {isGeneratingReport ? 'Generating...' : 'Generate Complete Report'}
              </button>
              
              <button 
                className="export-csv-btn" 
                onClick={exportCsv}
                disabled={isGeneratingReport}
              >
                <FiDownload /> Export CSV
              </button>
            </div>
          </div>

          {filterMenuOpen && (
            <div className="filter-panel">
              <div className="filter-section skills-section">
                <h3><FiBarChart2 className="filter-icon" /> Skills</h3>
                <div className="filter-skills-container">
                  {allSkills.slice(0, 20).map(skill => (
                    <div 
                      key={skill} 
                      className={`filter-skill-tag ${filters.skills.includes(skill) ? 'active' : ''}`}
                      onClick={() => toggleSkillFilter(skill)}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="filter-section">
                <h3><FiMap className="filter-icon" /> Location</h3>
                <select 
                  className="filter-select"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                >
                  <option value="">All Locations</option>
                  {allLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-section">
                <h3><FiUsers className="filter-icon" /> Experience Level</h3>
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="experience" 
                      value="all"
                      checked={filters.experience === 'all'} 
                      onChange={() => setFilters({...filters, experience: 'all'})}
                    />
                    <span className="radio-custom"></span>
                    All Levels
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="experience" 
                      value="beginner"
                      checked={filters.experience === 'beginner'} 
                      onChange={() => setFilters({...filters, experience: 'beginner'})}
                    />
                    <span className="radio-custom"></span>
                    Beginner
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="experience" 
                      value="intermediate"
                      checked={filters.experience === 'intermediate'} 
                      onChange={() => setFilters({...filters, experience: 'intermediate'})}
                    />
                    <span className="radio-custom"></span>
                    Intermediate
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="experience" 
                      value="expert"
                      checked={filters.experience === 'expert'} 
                      onChange={() => setFilters({...filters, experience: 'expert'})}
                    />
                    <span className="radio-custom"></span>
                    Expert
                  </label>
                </div>
              </div>
              
              <div className="filter-actions">
                <button className="clear-filters-btn" onClick={clearFilters}>
                  <FiX /> Clear All Filters
                </button>
                <button className="apply-filters-btn" onClick={() => setFilterMenuOpen(false)}>
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          <div className="results-summary">
            <span className="results-count">
              Found <strong>{filteredProfiles.length}</strong> {filteredProfiles.length === 1 ? 'users' : 'users'}
            </span>
            
            {(filters.skills.length > 0 || filters.location || filters.experience !== 'all') && (
              <div className="active-filters">
                <span>Active filters:</span>
                {filters.location && (
                  <div className="active-filter-tag">
                    Location: {filters.location}
                    <button 
                      className="remove-filter"
                      onClick={() => setFilters({...filters, location: ''})}
                    >
                      <FiX />
                    </button>
                  </div>
                )}
                
                {filters.experience !== 'all' && (
                  <div className="active-filter-tag">
                    Experience: {filters.experience.charAt(0).toUpperCase() + filters.experience.slice(1)}
                    <button 
                      className="remove-filter"
                      onClick={() => setFilters({...filters, experience: 'all'})}
                    >
                      <FiX />
                    </button>
                  </div>
                )}
                
                {filters.skills.map(skill => (
                  <div key={skill} className="active-filter-tag">
                    Skill: {skill}
                    <button 
                      className="remove-filter"
                      onClick={() => toggleSkillFilter(skill)}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`profiles-${viewMode === 'grid' ? 'grid' : 'list'}`}>
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} viewMode={viewMode} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10C11.6569 10 13 8.65685 13 7C13 5.34315 11.6569 4 10 4C8.34315 4 7 5.34315 7 7C7 8.65685 8.34315 10 10 10Z" stroke="#d0d0d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 15C16 12.7909 13.3137 11 10 11C6.68629 11 4 12.7909 4 15" stroke="#d0d0d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 8L15 12" stroke="#d0d0d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 8L19 12" stroke="#d0d0d0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4>No developers found</h4>
                <p>Try adjusting your search or filters to find more talented professionals</p>
                <button className="reset-search-btn" onClick={clearFilters}>
                  Reset Search
                </button>
              </div>
            )}
          </div>
          
          {filteredProfiles.length > 0 && (
            <div className="profiles-footer">
              <p>Showing {filteredProfiles.length} of {profiles.length} total developers</p>
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
/**
 * This component //TODO
 *
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'

import fetchResearchPeriods from '../../utils/fetchResearchPeriods'
import fetchUmbrellaTopics from '../../utils/fetchUmbrellaTopics'
import fetchDisciplines from '../../utils/fetchDisciplines'
import fetchMajors from '../../utils/fetchMajors'
import fetchDepartments from '../../utils/fetchDepartments'

import { useNavigate } from 'react-router-dom'

import { backendUrl } from '../../resources/constants'

function ManageVariables () {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)

  const [researchPeriods, setResearchPeriods] = useState([])
  const [umbrellaTopics, setUmbrellaTopics] = useState([])
  const [discipline, setDisciplines] = useState([])
  const [selectedMajors, setSelectedMajors] = useState({})
  const [departments, setDepartments]  = useState([])

  useEffect(() => {
    async function fetchData () {
      try {

      } catch (err) {
        
      }
    }
    fetchData()
  })
}
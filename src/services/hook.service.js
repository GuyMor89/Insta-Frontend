import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

export const hookService = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()

  return { location, dispatch, params, navigate }
}

export function useEffectSkipFirst(effectCallback, dependencies) {
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    return effectCallback();
  }, dependencies)
}

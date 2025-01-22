export function fadeInOut(container: HTMLElement, objects: HTMLElement[], buffer: number): void {
  const workingPosition = window.scrollY + window.innerHeight/2
  if(workingPosition > container.offsetTop && workingPosition < ((container.clientHeight/buffer)+container.offsetTop))  {
    const factor =  ((workingPosition-container.offsetTop)*buffer) / container.clientHeight;
    objects.forEach(object => {
      object.style.scale = factor.toString()
      object.style.opacity = factor.toString()
    })
  } else if(workingPosition > ((container.clientHeight/buffer)+container.offsetTop) &&
    workingPosition < ((container.clientHeight-(container.clientHeight/buffer))+container.offsetTop)) {
    objects.forEach(object => {
      object.style.scale = "1"
      object.style.opacity = "1"
    })
  } else if(workingPosition > ((container.clientHeight-(container.clientHeight/buffer))+container.offsetTop) &&
    workingPosition < (container.clientHeight+container.offsetTop)) {
    const factor =  1 - ((workingPosition-((container.clientHeight-(container.clientHeight/buffer))+container.offsetTop))*buffer) / container.clientHeight;
    objects.forEach(object => {
      object.style.scale = factor.toString()
      object.style.opacity = factor.toString()
    })
  } else {
    objects.forEach(object => {
      object.style.scale = "0"
      object.style.opacity = "0"
    })
  }
}
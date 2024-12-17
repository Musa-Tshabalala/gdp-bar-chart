document.addEventListener('DOMContentLoaded', () => {
    
    const height = 500;
    const paddingBottom = 30;
    const paddingLeft = 50;

    const fetchDisplay = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json');

            const object = await response.json();

            const figures = object.data.map(el => el[1])
            const fullDate = object.data.map(el => el[0])
            const highestGDP = d3.max(figures)
            const lowestGDP = d3.min(figures)
            const dateObj = object.data.map(el => new Date(el[0]));
            const maxDate = new Date(d3.max(dateObj))
            maxDate.setMonth(maxDate.getMonth() + 3)
            
            const xScale = d3.scaleTime()
                             .domain([d3.min(dateObj), maxDate])
                             .range([0, object.data.length * 5])

            const yScale = d3.scaleLinear()
                            .domain([0, highestGDP])
                            .range([height - paddingBottom, 10])

            const yAxis = d3.axisLeft(yScale)
            const xAxis = d3.axisBottom(xScale)

            const body = d3.select('body')
                           .style('display', 'flex')
                           .style('align-items', 'center')
                           .style('justify-content', 'center')
                           .style('flex-direction', 'column')
                           
            const guide = body.append('div')
                              .style('display', 'block')
                              .attr('id', 'guide')
                              .style('background-color', 'green')
                              .style('border', '2px solid black')
                              .style('margin', '10px')
                              .style('min-width', '358px')
                              .style('min-height', '88px')

                        guide.append('h3')
                             .text('Guide')
                             .style('color', 'white')
                             .style('font-weight', 'bolder')
                             .style('font-size', '25px')
                             .style('text-align', 'center')

                        guide.append('div')
                             .attr('id', 'increase')
                             .style('display', 'inline-block')
                             .style('min-width', '19px')
                             .style('min-height', '19px')
                             .style('border', '1px solid black')
                             .style('border-radius', '50%')
                             .style('margin-left', '5px')
                             .style('background-color', 'rgb(0, 255, 0)')

                        guide.append('p')
                             .style('display', 'inline')
                             .text(' Increase in GDP')
                             .style('color', 'white')
                             .style('font-size', '21px')
                             .style('margin-right', '5px')

                              
                        guide.append('div')
                             .attr('id', 'decrease')
                             .style('display', 'inline-block')
                             .style('min-width', '19px')
                             .style('min-height', '19px')
                             .style('border', '1px solid black')
                             .style('border-radius', '50%')
                             .style('margin-left', '5px')
                             .style('background-color', 'rgb(0, 100, 0)')

                        guide.append('p')
                             .style('display', 'inline')
                             .text(' Decrease in GDP')
                             .style('color', 'white')
                             .style('font-size', '21px')
                             .style('margin-right', '5px')

                        guide.append('p')
                             .style('color', 'white')
                             .style('font-size', '20px')
                             .style('text-align', 'center')
                             .text(`Date Span: ${fullDate[0]} to ${fullDate[fullDate.length - 1]}`)

                        guide.append('p')
                             .style('color', 'white')
                             .style('font-size', '20px')
                             .style('text-align', 'center')
                             .text(`Lowest GDP: ${lowestGDP} (Billion)`)

                         guide.append('p')
                              .style('color', 'white')
                              .style('font-size', '20px')
                              .style('text-align', 'center')
                              .text(`Highest GDP: ${highestGDP} (Billion)`)
                              

              const tooltip = body.append('div')
                            .attr('id', 'tooltip')
                        
              const svg = body
                          .append('svg')
                          .attr('width', object.data.length * 5 + (paddingLeft * 2))
                          .attr('height', height)
                          .style('background-color', 'green');

    svg.selectAll('rect')
       .data(object.data)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('x', (_d, i) => i * 5 + paddingLeft)
       .attr('y', d => yScale(d[1]))
       .attr('width', 4)
       .attr('height', d => height - paddingBottom - yScale(d[1]))
       .attr('data-date', d => d[0])
       .attr('data-gdp', d => d[1])
       .attr('fill', (d, i) => d[1] < figures[i - 1] ? 'rgb(0, 100, 0)' : 'rgb(0, 200, 0)')
       .style('stroke-width', 1)
       .style('stroke', (d, i) => d[1] < figures[i - 1] ? 'rgb(0, 150, 0)' : 'rgb(0, 255, 0)')
       .attr('rx', 10)
       .attr('ry', 10)
       
       .on('mouseover', function (event, d, i) {
        const gdp = d3.select(this).attr('data-gdp')
        const date = d3.select(this).attr('data-date')
        let quarter;
        const currDate = date.substring(5,7)
        if (currDate === '01') quarter = 'Q1';
        if (currDate === '04') quarter = 'Q2';
        if (currDate === '07') quarter = 'Q3';
        if (currDate === '10') quarter = 'Q4';

        tooltip.style('display', 'block')
               .style('left', `${event.pageX + 10}px`)
               .style('top', `${event.pageY + 20}px`)
               .attr('data-date', `${date}`)
               .attr('data-gdp', `${gdp}`)
               .html(`${date} <br> ${quarter} <br> ${gdp} (Billion)`)
       })

       .on('mouseout', () => tooltip.style('display', 'none'))

       svg.append('g')
          .attr('transform', `translate(${paddingLeft}, 0)`)
          .attr('id', 'y-axis')
          .call(yAxis)

       svg.append('g')
          .attr('transform', `translate(${paddingLeft}, ${height - paddingBottom})`)
          .attr('id', 'x-axis')
          .call(xAxis)
                                    
        } catch(err) {
            console.log('Error Found: ' + err)
        }
    }

fetchDisplay()
});



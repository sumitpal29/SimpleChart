function fc(renderdivId,separator,width,height,chartdata) {
    this.chartdata = chartdata;
    this.renderdivId = "mydiv";
    this.separator = "|";
    this.width = "300";
    this.height = "400";
    this.yaxisticks = 6;
    this.xaxisticks = 5;
 
    this.render = function () {
        this.chartdata = chartdata;
        this.renderdivId = renderdivId;
        this.separator = separator;
        this.width = width;
        this.height = height;
        this.plotdata();
    };
    this.calPicks=function(ub,lb){
        if((ub-lb)==ub){
            yaxisticks = 5;
        }else{
          if((ub/lb)<3){
                yaxisticks = 3
            }else if((ub/lb)<6){
                yaxisticks = 5
            }else{
                yaxisticks = 4;
            }  
        }
      return yaxisticks;  
    };
    this.placezeros= function(data,range,method){
        if(method==0){
            while (data.length < range) {
             data = '0'+data;
            }
            return "0."+data;
        }else{
            while (data.length < range) {
             data =  data+'0';
            }
            return data;
        }
    };
    this.createlimits= function(ul,ll){
                  var ullength = ul.length;
                  var lllength = ll.length;
                  var cnt; 
                  //lengths of the strings retrived
                  console.log("max element length: "+ullength+" "+ul);
                  //data does not have leading zeros
                  if(ul[0]==0){
                    cnt=0;
                    for(var i=0;i<ullength;i++){
                        if(ul[i]==0){
                            cnt++;
                        }else{
                            break;
                        }
                    }
                    cnt++;
                    if(ul[0]==9){
                        ul=1;
                    }else{
                        ul = ul.replace(/^0+/, '');
                        ul = ul.substr(0,1);
                        ul = (parseInt(ul)+1).toString();
                        ul = this.placezeros(ul,cnt,0);
                    }
                  }else{
                    ul = ul.substr(0,1);
                    ul = (parseInt(ul)+1).toString();
                    console.log("now ul :"+ul);
                    ul = this.placezeros(ul,ullength,1);
                    console.log("now ul :"+ul);
                  }
                  if(ll[0]==0){
                    cnt=0;
                    for(var i=0;i<lllength;i++){
                        if(ll[i]==0){
                            cnt++;
                        }else{
                            break;
                        }
                    }
                    cnt++;
                    ll = ll.replace(/^0+/, '');
                    ll = ll.substr(0,1);
                    ll = (parseInt(ll)+1).toString();
                    ll = this.placezeros(ll,cnt,0);
                  }else{
                    ll = ll.substr(0,1);
                    ll = this.placezeros(ll,lllength,1);
                  }
                   console.log([ul,ll]);
                   return [ul,ll]; 
                };
     function calculateMaxMin(obj){
        //will return a array of max min values or obj
        var noOfGraphs = (obj.chartinfo.yaxisnames).length,
        noofiteration=((obj.dataset).length-1),j;
        var maxminobj={};
        var max,min;
        for(var i=0;i<noOfGraphs;i++){
            min = obj.dataset[noOfGraphs].data[i];max=min;
            j= noofiteration;
             while(j>=0){
                 if((obj.dataset[j].data[i])>max){ max =obj.dataset[j].data[i]}
                 if((obj.dataset[j].data[i])<min){ min =obj.dataset[j].data[i]}
                 j--;
             }
             maxminobj[i] = {"max": max,"min": min}; //storing max and min value in this object
        }
         return maxminobj;  //returning max and min stored in this object
    };
    this.plotdata = function(){
                var maxmin = calculateMaxMin(this.chartdata);
                var max,min,newmax,newmin,limits,divisiony,divisionX,plotRatio;
                for(var k in maxmin){
                    max = maxmin[k].max;
                    min = maxmin[k].min;
                    if(max%1!=0){//decimal
                        //newmax = max.toString().split(".")[0];
                        if(max<1){
                            newmax = max.toString().split(".")[1];
                        }else{
                            newmax = max.toString().split(".")[0];
                        }           
                    }else{
                        newmax = max.toString();
                    }
                    if(min%1!=0){
                        if(min<1){
                            newmin = min.toString().split(".")[1];
                        }else{
                            newmin = min.toString().split(".")[0];
                        }
                    }else{
                        newmin = min.toString();
                    }           
                limits = this.createlimits(newmax,newmin);
                newmax = limits[0]; newmin = limits[1];
                yaxisticks= this.calPicks(parseInt(limits[0]),parseInt(limits[1]));
                xaxisticks= this.chartdata.dataset.length;              
                this.measureMent(xaxisticks,yaxisticks,newmax,newmin,yaxisticks,xaxisticks,k);
                
            }
    };
    this.measureMent = function(xaxisticks,yaxisticks,newmax,newmin,yaxisticks,xaxisticks,item){
        var svgHeight = (this.height);
        var svgWidth = (this.width);
        var chartHeight=svgHeight-100;
        var chartWidth=svgWidth-100;
        var divisionX = (chartWidth) / xaxisticks;
        var divisiony = (chartHeight) / yaxisticks;
        var plotRatio = (chartHeight-divisiony) / newmax;
        var dataset="",ycord,xcord,marginxy = 50;
        var calculationX,calculationY ;

            for(var k in this.chartdata.dataset){
                //console.log(this.chartdata.dataset[k].data[i]);
                xcord= (divisionX*(parseInt(k)+1))+marginxy;
                ycord = marginxy+chartHeight-(divisiony+Math.round(this.chartdata.dataset[k].data[item]*plotRatio));
                dataset += xcord+","+ycord+" ";
            }
        
        console.log(svgHeight+" "+svgWidth+" "+chartHeight+" "+chartWidth+" "+divisiony+" "+divisionX+" "+yaxisticks+" "+xaxisticks);


            var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute('width', svgWidth);
                svg.setAttribute('height', svgHeight);
                svg.setAttribute("style","width:100%; margin-left:5%; margin-top:5%;");
                var url = "http://www.w3.org/2000/svg";

                this.createLines(url,svg,marginxy,(marginxy-20),marginxy,(chartHeight+marginxy),"stroke:#000000; fill:none;");
                this.createLines(url,svg,marginxy,(chartHeight+marginxy),(chartWidth+marginxy+20),(chartHeight+marginxy),"stroke:#000000; fill:none;");
                this.createPoly(url,svg,dataset);

                var coordinates = dataset.split(" "),xy;
                for(i = 0;i<(coordinates.length-1);i++){               
                    xy = coordinates[i].split(","); 
                    this.createeCirles(url,svg,xy[0],xy[1],4);
                }
                
                for(var i=0;i<xaxisticks;i++){
                    calculationX = parseInt(divisionX)*(i+1)+marginxy;
                    this.createLines(url,svg,calculationX,(chartHeight+marginxy+5),calculationX,(chartHeight+marginxy-5),"stroke:#000000; fill:none;");
                    var textVal =this.chartdata.dataset[i].time;
                    this.createText(url,svg,(calculationX-30),(chartHeight+marginxy+25),textVal);
                }

                var title = this.chartdata.chartinfo.yaxisnames[item];
                this.createText(url,svg,'37%',(25),title);

                for(i=0;i<yaxisticks;i++){
                    calculationY =(parseInt(divisiony)*i)+marginxy;
                    var titleY =newmax - Math.round((newmax/yaxisticks)*i);

                    this.createText(url,svg,(marginxy-40),(calculationY+5),titleY);
                    this.createLines(url,svg,(marginxy-5),(calculationY),(marginxy+5),(calculationY),"stroke:#000000; fill:none;");
                    this.createLines(url,svg,(marginxy+10),(calculationY),(chartWidth+marginxy+20),(calculationY),"stroke:rgba(72,118,255,0.7); stroke-width:0.3;stroke-dasharray:10,10 ; fill:none;");
                }   
                document.getElementById("chart").appendChild(svg);
                dataset = "";

    };
    this.createLines = function(url,svg,x1,y1,x2,y2,styleStr){
        var lineXY = document.createElementNS(url, "line");
            lineXY.setAttributeNS(null, "x1",x1);
            lineXY.setAttributeNS(null, "y1",y1);
            lineXY.setAttributeNS(null, "x2",x2);
            lineXY.setAttributeNS(null, "y2",y2);
            lineXY.setAttribute('style', styleStr);
            svg.appendChild(lineXY);
    };
    this.createeCirles = function(url,svg,x,y,r){
            var shape = document.createElementNS(url, "circle");
            shape.setAttributeNS(null, "cx", x);
            shape.setAttributeNS(null, "cy", y);
            shape.setAttributeNS(null, "r",  r);
            shape.setAttributeNS(null, "fill", "rgba(46,139,87,0.6)");
            svg.appendChild(shape);
    };
    this.createPoly = function(url,svg,dataset){
        var shape = document.createElementNS(url, "polyline");
        shape.setAttributeNS(null, "points", dataset);
        shape.setAttributeNS(null, "stroke", "green");
        shape.setAttribute('style', "stroke:#5BDE6C; fill:none;");
        svg.appendChild(shape); 
    };
    this.createText = function(url,svg,x,y,textVal){
        var newText = document.createElementNS(url,"text");
            newText.setAttributeNS(null,"x",x);     
            newText.setAttributeNS(null,"y",y); 
            newText.setAttributeNS(null,"font-size","17");
        var textNode = document.createTextNode(textVal);
            newText.appendChild(textNode);
            svg.appendChild(newText);
    };
}//end of the library
